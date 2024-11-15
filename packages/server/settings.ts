import fs from 'node:fs/promises';
import {inspect} from 'node:util';
import {fastifyPlugin} from 'fastify-plugin';
import {settingsSchema, type ClockMode, type Settings} from 'shared';
import {
  type ZodTypeProvider,
  type FastifyPluginAsyncZod,
} from 'fastify-type-provider-zod';
import {defaultSettings} from './default-settings.ts';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    settings: Settings;
    mode: ClockMode;
  }
}

export const settings: FastifyPluginAsyncZod = fastifyPlugin(
  // @ts-expect-error options aren't used, but left here for reference
  async (fastify, options) => {
    // Load settings or use defaults
    let currentSettings: Settings;
    try {
      currentSettings = JSON.parse(
        await fs.readFile('schedule.json', 'utf8'),
      ) as Settings;
    } catch (error) {
      fastify.log.error(error);
      fastify.log.error('Error reading settings.json, using default settings');
      currentSettings = defaultSettings;
    }

    fastify.log.info(
      `Loaded settings: ${inspect(currentSettings, {depth: 8, colors: true})}`,
    );

    fastify.decorate('settings', currentSettings);

    fastify.withTypeProvider<ZodTypeProvider>().get(
      '/settings',
      {
        schema: {
          response: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            200: settingsSchema,
          },
        },
      },
      // @ts-expect-error params aren't used, but left here for reference
      async (request, reply) => {
        return fastify.settings;
      },
    );

    fastify.withTypeProvider<ZodTypeProvider>().post(
      '/settings',
      {
        schema: {
          body: settingsSchema,
        },
      },
      // @ts-expect-error params aren't used, but left here for reference
      async (request, reply) => {
        fastify.settings = request.body;
        request.server.updateClockState();
        return fastify.settings;
      },
    );
  },
);
