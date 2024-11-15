import process from 'node:process';
import {buildApp} from './app.ts';

const fastify = await buildApp();

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
