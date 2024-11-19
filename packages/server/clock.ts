import {inspect} from 'node:util';
import {fastifyPlugin} from 'fastify-plugin';
import {DateTime} from 'luxon';
import {type FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {clockStateSchema} from 'shared';
import {type ClockStateDateTime, getClockState} from 'shared/clock-state';
import {execa} from 'execa';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    clockState: ClockStateDateTime;
    updateClockState: () => void;
  }
}

export const clock: FastifyPluginAsyncZod = fastifyPlugin(
  // @ts-expect-error params aren't used, but left here for reference
  async (fastify, options) => {
    let handle: NodeJS.Timeout | undefined;

    fastify.decorate(
      'clockState',
      getClockState(fastify.settings, DateTime.now()),
    );
    fastify.decorate('updateClockState', updateClockState);

    fastify.addHook('onClose', async () => {
      fastify.log.info('Clearing clock timeout');
      if (handle) {
        clearTimeout(handle);
      }
    });

    // Update the clock state when settings are successfully updated
    fastify.addHook('onResponse', async (request, reply) => {
      if (
        request.method === 'POST' &&
        request.routeOptions.url === '/settings' &&
        reply.statusCode === 201
      ) {
        // Update the clock state, but don't play a sound
        // This lets users change the schedule silently
        updateClockState(false);
      }
    });

    // Set the initial brightness (but don't play a sound)
    void setBrightness();

    // Start the first clock transition
    // Don't bother disabling sound since the state is already set and shouldn't trigger a transition
    updateClockState();

    function updateClockState(isUpdateSoundActive = true) {
      const previousClockState = fastify.clockState;
      fastify.clockState = getClockState(fastify.settings, DateTime.now());
      fastify.log.info('Updating clock state');
      fastify.log.info(inspect(fastify.clockState, {colors: true}));

      if (handle) {
        clearTimeout(handle);
      }

      handle = setTimeout(
        () => {
          handle = undefined;
          fastify.log.info('Clock update');
          updateClockState();
        },
        // 5000,
        fastify.clockState.nextTransition
          .diff(DateTime.now())
          .as('milliseconds') + 1000,
      );

      // Did a transition occur?
      if (previousClockState.currentMode !== fastify.clockState.currentMode) {
        fastify.log.info(
          `Clock mode changed to ${fastify.clockState.currentMode}`,
        );
        // Always set the brightness
        void setBrightness();

        // Only play sounds if the sound is active (not the first load)
        if (fastify.clockState.isSoundActive && isUpdateSoundActive) {
          void playSound();
        }
      }

      // Update all clients of changes to the clock state
      fastify.log.info(
        `Sending clock state to ${fastify.websocketServer.clients.size} connected clients`,
      );
      for (const client of fastify.websocketServer.clients) {
        client.send(JSON.stringify(fastify.clockState));
      }
    }

    fastify.get(
      '/clock',
      {
        schema: {
          response: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            200: clockStateSchema,
          },
        },
      },
      // @ts-expect-error params aren't used, but left here for reference
      (request, reply) => {
        const response = {
          ...fastify.clockState,
          nextTransition: fastify.clockState.nextTransition.toISO(),
          previousTransition: fastify.clockState.previousTransition.toISO(),
        };

        request.log.info(`${inspect(response, {colors: true})}`);
        return response;
      },
    );

    fastify.post('/toggle', async (_request, reply) => {
      fastify.log.info('Toggling clock state');
      fastify.clockState = {
        ...fastify.clockState,
        currentMode: fastify.clockState.currentMode === 'day' ? 'night' : 'day',
      };
      void setBrightness();
      void playSound();
      fastify.log.info(
        `Notifying ${fastify.websocketServer.clients.size} connected clients of toggle`,
      );
      for (const client of fastify.websocketServer.clients) {
        client.send(JSON.stringify(fastify.clockState));
      }

      if (handle) {
        clearTimeout(handle);
      }

      handle = setTimeout(() => {
        handle = undefined;
        fastify.log.info('End of toggle');
        updateClockState();
      }, 5000);

      return reply.code(200).send('');
    });

    async function playSound() {
      try {
        return await execa(
          fastify.clockState.currentMode === 'day'
            ? './bin/wake-sound.sh'
            : './bin/sleep-sound.sh',
        );
      } catch (error) {
        fastify.log.error(
          `Error playing sound for '${fastify.clockState.currentMode}'`,
        );
        fastify.log.error(error);
      }
    }

    async function setBrightness() {
      const level = fastify.clockState.currentMode === 'day' ? 255 : 0;
      try {
        return await execa('sudo', [
          '-n',
          './bin/set-brightness.sh',
          level.toString(),
        ]);
      } catch (error) {
        fastify.log.error(`Error setting brightness '${level}'`);
        fastify.log.error(error);
      }
    }
  },
  {
    name: 'clock',
    dependencies: ['settings', '@fastify/websocket'],
    decorators: {
      fastify: ['websocketServer'],
    },
  },
);
