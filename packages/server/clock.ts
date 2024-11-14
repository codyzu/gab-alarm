import {inspect} from 'node:util';
import {fastifyPlugin} from 'fastify-plugin';
import {DateTime} from 'luxon';
import {type FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {clockStateSchema} from 'shared';
import {type ClockStateDateTime, getClockState} from 'shared/clock-state';

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

    // Start the first clock transition
    updateClockState();

    function updateClockState() {
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

      // Update all clients of changes to the clock state
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
  },
);
