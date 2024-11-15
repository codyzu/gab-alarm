/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import assert from 'node:assert';
import {DateTime} from 'luxon';
import {getClockState} from '../clock-state.ts';
import {type Settings} from '../schedule.types.ts';

let settings: Settings;

test.beforeEach(() => {
  settings = {
    override: {
      transition: {time: {hours: 8, minutes: 0}, sound: true},
      setAt: DateTime.fromISO('2000-01-01').toISO()!,
    },
    schedule: {
      monday: {
        day: {time: {hours: 6, minutes: 10}, sound: true},
        night: {time: {hours: 20, minutes: 30}, sound: true},
      },
      tuesday: {
        day: {time: {hours: 7, minutes: 20}, sound: true},
        night: {time: {hours: 20, minutes: 30}, sound: true},
      },
      wednesday: {
        day: {time: {hours: 7, minutes: 50}, sound: true},
        night: {time: {hours: 20, minutes: 30}, sound: true},
      },
      thursday: {
        day: {time: {hours: 7, minutes: 20}, sound: true},
        night: {time: {hours: 20, minutes: 30}, sound: true},
      },
      friday: {
        day: {time: {hours: 7, minutes: 20}, sound: true},
        night: {time: {hours: 21, minutes: 0}, sound: true},
      },
      saturday: {
        day: {time: {hours: 8, minutes: 30}, sound: false},
        night: {time: {hours: 21, minutes: 0}, sound: true},
      },
      sunday: {
        day: {time: {hours: 8, minutes: 30}, sound: false},
        night: {time: {hours: 20, minutes: 30}, sound: true},
      },
    },
  };
});

test('just after today day', (t) => {
  settings.schedule.monday.day.time.hours = 6;
  settings.schedule.monday.day.time.minutes = 10;
  const now = DateTime.fromISO('2022-01-10T06:11:00').set({weekday: 1});

  const state = getClockState(settings, now);

  assert.equal(state.currentMode, 'day');
});

test('just before today day', (t) => {
  settings.schedule.monday.day.time.hours = 6;
  settings.schedule.monday.day.time.minutes = 10;
  const now = DateTime.fromISO('2022-01-10T06:09:00').set({weekday: 1});

  const state = getClockState(settings, now);

  assert.equal(state.currentMode, 'night');
});

test('just after today night', (t) => {
  settings.schedule.monday.night.time.hours = 19;
  settings.schedule.monday.night.time.minutes = 30;
  const now = DateTime.fromISO('2022-01-10T19:31:00').set({weekday: 1});
  const state = getClockState(settings, now);
  assert.equal(state.currentMode, 'night');
});

test('just before today night', (t) => {
  settings.schedule.monday.night.time.hours = 19;
  settings.schedule.monday.night.time.minutes = 30;
  const now = DateTime.fromISO('2022-01-10T19:29:00').set({weekday: 1});
  const state = getClockState(settings, now);
  assert.equal(state.currentMode, 'day');
});

test('after midnight', (t) => {
  settings.schedule.monday.night.time.hours = 19;
  settings.schedule.monday.night.time.minutes = 30;
  const now = DateTime.fromISO('2022-01-11T00:01:00').set({weekday: 1});
  const state = getClockState(settings, now);
  assert.equal(state.currentMode, 'night');
});

test('just after today day with override set today ', (t) => {
  const now = DateTime.fromISO('2022-01-10T06:11:00').set({weekday: 1});
  settings.override.setAt = DateTime.fromISO('2022-01-10T06:09:00').toISO()!;
  const state = getClockState(settings, now);
  assert.equal(state.currentMode, 'night');
  assert.equal(state.isOverrideActive, true);
});

test('override set today but it is now night time', (t) => {
  settings.schedule.monday.night.time.hours = 19;
  settings.schedule.monday.night.time.minutes = 30;
  settings.override.setAt = DateTime.fromISO('2022-01-10T13:00:00').toISO()!;
  const now = DateTime.fromISO('2022-01-10T21:00:00').set({weekday: 1});

  const state = getClockState(settings, now);

  assert.equal(state.currentMode, 'night');
  assert.equal(state.isOverrideActive, true);
});

test('override set last night for late morning', (t) => {
  settings.schedule.monday.day.time.hours = 10;
  settings.schedule.monday.day.time.minutes = 30;
  settings.schedule.monday.night.time.hours = 19;
  settings.schedule.monday.night.time.minutes = 30;
  settings.override.transition.time.hours = 11;
  settings.override.transition.time.minutes = 30;
  settings.override.setAt = DateTime.fromISO('2022-01-10T14:00:00').toISO()!;

  const now = DateTime.fromISO('2022-01-11T11:25:00').set({weekday: 2});

  const state = getClockState(settings, now);

  assert.equal(state.currentMode, 'night');
  assert.equal(state.isOverrideActive, true);
});

test('just after override with override set today', (t) => {
  const now = DateTime.fromISO('2022-01-10T09:01:00').set({weekday: 1});
  settings.override.setAt = DateTime.fromISO('2022-01-10T06:09:00').toISO()!;
  const state = getClockState(settings, now);
  assert.equal(state.currentMode, 'day');
  assert.equal(state.isOverrideActive, false);
});
