import fs from 'node:fs/promises';
import process from 'node:process';
import fastifyFactory from 'fastify';
import FastifyVite from '@fastify/vite';
import fastifyStatic from '@fastify/static';
import {execa} from 'execa';
import {type Settings} from './client/src/schedule.types.js';

const fastify = fastifyFactory({
  // Logger: true,
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
});

await fastify.register(fastifyStatic, {
  root: new URL('public', import.meta.url),
});

// Await fastify.register(fastifyStatic, {
//   root: new URL('../dist', import.meta.url),
//   // Prefix: '/public/', // Optional: default '/'
//   // constraints: {host: 'example.com'}, // Optional: default {}
// });

await fastify.register(FastifyVite, {
  root: new URL(import.meta.url).pathname,
  dev: process.argv.includes('--dev'),
  spa: true,
});

fastify.get('/', (request, reply) => {
  reply.html();
});

fastify.get('/admin', (request, reply) => {
  reply.html();
});

fastify.get('/schedule', async (request, reply) => {
  const scheduleRaw = await fs.readFile('./schedule.json', 'utf8');
  const schedule = JSON.parse(scheduleRaw) as Settings;
  return schedule;
});
fastify.post('/schedule', async (request, reply) => {
  console.log('body', request.body);
  await fs.writeFile(
    './schedule.json',
    JSON.stringify(request.body, null, 2),
    'utf8',
  );
  void reply.code(201);
});

fastify.post('/morning', async (request, reply) => {
  const result = await Promise.allSettled([
    execa('./bin/wake-sound.sh'),
    setBrightness(255),
  ]);

  if (result.some((r) => r.status === 'rejected')) {
    void reply.code(500);
  } else {
    void reply.code(200);
  }

  return result;
});

fastify.post('/night', async (request, reply) => {
  const result = await Promise.allSettled([
    execa('./bin/sleep-sound.sh'),
    setBrightness(0),
  ]);

  if (result.some((r) => r.status === 'rejected')) {
    void reply.code(500);
  } else {
    void reply.code(200);
  }

  return result;
});

async function setBrightness(level: number) {
  return execa('sudo', ['-n', './bin/set-brightness.sh', level.toString()]);
}

await fastify.vite.ready();

// Fastify.get('/', function (request, reply) {
//   reply.send({hello: 'world'});
// });

fastify.listen({port: 3000, host: '0.0.0.0'}, function (error, address) {
  if (error) {
    fastify.log.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  // Server is now listening on ${address}
});

console.log(fastify.printRoutes());
