// Import path from 'node:path';
import fs from 'node:fs/promises';
import fastifyFactory from 'fastify';
// Import fastifyStatic from '@fastify/static';
import FastifyVite from '@fastify/vite';

const fastify = fastifyFactory({
  // Logger: true,
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

console.log(new URL('../dist', import.meta.url).path);

// Await fastify.register(fastifyStatic, {
//   root: new URL('../dist', import.meta.url),
//   // Prefix: '/public/', // Optional: default '/'
//   // constraints: {host: 'example.com'}, // Optional: default {}
// });

await fastify.register(FastifyVite, {
  root: import.meta.url,
  dev: process.argv.includes('--dev'),
  spa: true,
});

fastify.get('/', (request, reply) => {
  return reply.html();
});

fastify.get('/admin', (request, reply) => {
  return reply.html();
});

fastify.get('/schedule', async (request, reply) => {
  const scheduleRaw = await fs.readFile('./schedule.json', 'utf8');
  const schedule = JSON.parse(scheduleRaw);
  return schedule;
});
fastify.post('/schedule', async (request, reply) => {
  await fs.writeFile('./schedule.json', request.body, 'utf8');
  reply.code(201);
});

await fastify.vite.ready();

// Fastify.get('/', function (request, reply) {
//   reply.send({hello: 'world'});
// });

fastify.listen({port: 3000, host: '0.0.0.0'}, function (error, address) {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  // Server is now listening on ${address}
});

console.log(fastify.printRoutes());
