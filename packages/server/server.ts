import fs from 'node:fs/promises';
import process from 'node:process';
import fastifyFactory from 'fastify';
import fastifyStatic from '@fastify/static';
import {execa} from 'execa';
import {settingsSchema} from 'shared';

const fastify = fastifyFactory({
  // Logger: true,
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
      options: {colorize: true},
    },
  },
});

await fastify.register(fastifyStatic, {
  root: new URL('node_modules/client/dist', import.meta.url),
});

// @ts-expect-error params aren't used, but left here for reference
fastify.get('/', (request, reply) => {
  return reply.sendFile('index.html');
});

// @ts-expect-error params aren't used, but left here for reference
fastify.get('/admin', (request, reply) => {
  return reply.sendFile('index.html');
});

// @ts-expect-error params aren't used, but left here for reference
fastify.get('/schedule', async (request, reply) => {
  const scheduleRaw = await fs.readFile('./schedule.json', 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const scheduleObject = JSON.parse(scheduleRaw);

  const schedule = settingsSchema.parse(scheduleObject);
  return schedule;
});

fastify.post('/schedule', async (request, reply) => {
  console.log('body', request.body);

  // Const validatedSchedule = settingsSchema.parse(request.body);
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
