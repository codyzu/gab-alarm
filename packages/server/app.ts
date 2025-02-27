import fastifyFactory from 'fastify';
import fastifyStatic from '@fastify/static';
import {serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod';
import {fastifyWebsocket} from '@fastify/websocket';
import {settings} from './settings.ts';
import {clock} from './clock.ts';

export async function buildApp() {
  const fastify = fastifyFactory({
    // Logger: true,
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
        options: {colorize: true},
      },
    },
  });

  // Allow routes to use zod for the schemas
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(fastifyWebsocket);
  await fastify.register(settings);
  await fastify.register(clock);
  await fastify.register(fastifyStatic, {
    root: new URL('node_modules/client/dist', import.meta.url),
    maxAge: '1d',
    immutable: true,
  });

  fastify.get('/ws', {websocket: true}, (socket, request) => {
    fastify.log.info(`Client connected: ${request.ip} ${request.hostname}`);
    socket.on('message', (message: Uint8Array) => {
      fastify.log.info(`Client ${request.ip} message: ${message.toString()}`);
    });

    fastify.log.info('Sending initial clock state to websocket');
    socket.send(JSON.stringify(fastify.clockState));
  });

  // @ts-expect-error params aren't used, but left here for reference
  fastify.get('/', (request, reply) => {
    return reply.sendFile('index.html', {maxAge: 0, immutable: false});
  });

  // @ts-expect-error params aren't used, but left here for reference
  fastify.get('/clock.svg', (request, reply) => {
    // Favicon does not use cache-bursting, disable caching
    return reply.sendFile('clock.svg', {maxAge: 0, immutable: false});
  });

  // @ts-expect-error params aren't used, but left here for reference
  fastify.get('/admin', (request, reply) => {
    return reply.sendFile('index.html');
  });

  fastify.post('/reload', async (_request, _reply) => {
    for (const client of fastify.websocketServer.clients) {
      client.send('reload');
    }
  });

  return fastify;
}
