/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import assert from 'node:assert';
import promises from 'node:fs/promises';
import {type FastifyInstance} from 'fastify';
import {DateTime} from 'luxon';
import {type ClockState, type Settings} from 'shared';
import {buildApp} from '../app.ts';
import {defaultSettings} from '../default-settings.ts';

let app: FastifyInstance;
let settings: Settings;

test.beforeEach(() => {
  settings = structuredClone(defaultSettings);
});

test.afterEach(async () => {
  if (app) {
    console.log('closing app');
    await app.close();
  }
});

test('can get clock state', async (context) => {
  context.mock.timers.enable({apis: ['setTimeout', 'Date']});

  // Set the current time to Monday at 10:00
  const now = DateTime.fromISO('2022-01-10T10:00:00').set({weekday: 1});
  context.mock.timers.setTime(now.toMillis());
  console.log(now.toISO());

  settings.schedule.monday.day = {time: {hours: 9, minutes: 0}, sound: true};
  settings.schedule.monday.night = {time: {hours: 20, minutes: 0}, sound: true};

  context.mock.method(promises, 'readFile', async () => {
    console.log('reading schedule');
    return JSON.stringify(settings);
  });

  app = await buildApp();
  const response = await app.inject({url: '/clock'});
  assert.equal(response.statusCode, 200);

  const clockState: ClockState = await response.json();
  assert.equal(clockState.currentMode, 'day');
  assert.equal(clockState.nextMode, 'night');
  assert.equal(
    clockState.previousTransition,
    now.set({hour: 9, minute: 0}).toISO(),
  );
  assert.equal(
    clockState.nextTransition,
    now.set({hour: 20, minute: 0}).toISO(),
  );
  assert.equal(clockState.isOverrideActive, false);
});

test('can get clock state with override', async (context) => {
  context.mock.timers.enable({apis: ['setTimeout', 'Date']});

  // Set the current time to Monday at 10:00
  const now = DateTime.fromISO('2022-01-10T10:00:00').set({weekday: 1});
  context.mock.timers.setTime(now.toMillis());
  console.log(now.toISO());

  settings.schedule.monday.day = {time: {hours: 9, minutes: 0}, sound: true};
  settings.schedule.monday.night = {time: {hours: 20, minutes: 0}, sound: true};
  settings.schedule.sunday.night = {
    time: {hours: 19, minutes: 30},
    sound: true,
  };
  settings.override = {
    transition: {time: {hours: 10, minutes: 30}, sound: false},
    setAt: now.set({hour: 7}).toISO()!,
  };

  context.mock.method(promises, 'readFile', async () => {
    console.log('reading schedule');
    return JSON.stringify(settings);
  });

  app = await buildApp();
  const response = await app.inject({url: '/clock'});
  assert.equal(response.statusCode, 200);

  const clockState: ClockState = await response.json();
  assert.equal(clockState.currentMode, 'night');
  assert.equal(clockState.nextMode, 'day');
  assert.equal(
    clockState.previousTransition,
    now.minus({day: 1}).set({hour: 19, minute: 30}).toISO(),
  );
  assert.equal(
    clockState.nextTransition,
    now.set({hour: 10, minute: 30}).toISO(),
  );
  assert.equal(clockState.isOverrideActive, true);
});
