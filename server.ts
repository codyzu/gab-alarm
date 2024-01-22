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

// @ts-expect-error params aren't used, but left here for reference
fastify.get('/', (request, reply) => {
  reply.html();
});

// @ts-expect-error params aren't used, but left here for reference
fastify.get('/admin', (request, reply) => {
  reply.html();
});

// @ts-expect-error params aren't used, but left here for reference
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

// @ts-expect-error params aren't used, but left here for reference
fastify.post('/morning', async (request, reply) => {
  return setBrightness(255);
});

// @ts-expect-error params aren't used, but left here for reference
fastify.post('/morning-sound', async (request, reply) => {
  return execa('./bin/wake-sound.sh');
});

// @ts-expect-error params aren't used, but left here for reference
fastify.post('/night-sound', async (request, reply) => {
  return execa('./bin/sleep-sound.sh');
});

// @ts-expect-error params aren't used, but left here for reference
fastify.post('/night', async (request, reply) => {
  return setBrightness(0);
});

async function setBrightness(level: number) {
  return execa('sudo', ['-n', './bin/set-brightness.sh', level.toString()]);
}

await fastify.vite.ready();

// @ts-expect-error params aren't used, but left here for reference
fastify.listen({port: 3000, host: '0.0.0.0'}, function (error, address) {
  if (error) {
    fastify.log.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  // Server is now listening on ${address}
});

console.log(fastify.printRoutes());
