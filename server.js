// Import path from 'node:path';
import fastifyFactory from 'fastify';
import fastifyStatic from '@fastify/static';
import FastifyVite from '@fastify/vite';

const fastify = fastifyFactory({
  logger: true,
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

await fastify.vite.ready();

// Fastify.get('/', function (request, reply) {
//   reply.send({hello: 'world'});
// });

fastify.listen({port: 3000}, function (error, address) {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

console.log(fastify.printRoutes());
