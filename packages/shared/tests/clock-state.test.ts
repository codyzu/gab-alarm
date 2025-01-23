/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import assert from 'node:assert';
import {DateTime, Settings as LuxonSettings} from 'luxon';
import {getClockState} from '../clock-state.ts';
import {type ClockMode, days, type Settings} from '../schedule.types.ts';

// Avoid invalid ISO dates in tests
LuxonSettings.throwOnInvalid = true;

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

type ClockStateTest = {
  name: string;
  yesterdayNight: string;
  todayMorning: string;
  todayNight: string;
  tomorrowMorning: string;
  currentTime: string;
  expectedPreviousTransition: string;
  expectedNextTransition: string;
  expectedMode: ClockMode;
};

const clockStateTests: ClockStateTest[] = [
  {
    name: 'just before today morning',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-10T08:59:00',
    expectedPreviousTransition: '2022-01-09T20:00:00',
    expectedNextTransition: '2022-01-10T09:00:00',
    expectedMode: 'night',
  },
  {
    name: 'just after today morning',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-10T09:01:00',
    expectedPreviousTransition: '2022-01-10T09:00:00',
    expectedNextTransition: '2022-01-10T20:00:00',
    expectedMode: 'day',
  },
  {
    name: 'just before today night',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-10T19:59:00',
    expectedPreviousTransition: '2022-01-10T09:00:00',
    expectedNextTransition: '2022-01-10T20:00:00',
    expectedMode: 'day',
  },
  {
    name: 'just after today night',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-10T20:01:00',
    expectedPreviousTransition: '2022-01-10T20:00:00',
    expectedNextTransition: '2022-01-11T09:00:00',
    expectedMode: 'night',
  },
  {
    name: 'before midnight',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-10T23:59:00',
    expectedPreviousTransition: '2022-01-10T20:00:00',
    expectedNextTransition: '2022-01-11T09:00:00',
    expectedMode: 'night',
  },
  {
    name: 'after midnight',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',
    currentTime: '2022-01-11T00:01:00',
    expectedPreviousTransition: '2022-01-10T20:00:00',
    expectedNextTransition: '2022-01-11T09:00:00',
    expectedMode: 'night',
  },
];

for (const testData of clockStateTests) {
  // eslint-disable-next-line @typescript-eslint/no-loop-func
  test(`${testData.name}`, (t) => {
    // Set Yesterday night in schedule
    const yesterdayNight = DateTime.fromISO(testData.yesterdayNight);
    settings.schedule[days[yesterdayNight.weekday - 1]].night.time.hours =
      yesterdayNight.hour;
    settings.schedule[days[yesterdayNight.weekday - 1]].night.time.minutes =
      yesterdayNight.minute;

    // Set today morning in schedule
    const todayMorning = DateTime.fromISO(testData.todayMorning);
    settings.schedule[days[todayMorning.weekday - 1]].day.time.hours =
      todayMorning.hour;
    settings.schedule[days[todayMorning.weekday - 1]].day.time.minutes =
      todayMorning.minute;

    // Set today night in schedule
    const todayNight = DateTime.fromISO(testData.todayNight);
    settings.schedule[days[todayNight.weekday - 1]].night.time.hours =
      todayNight.hour;
    settings.schedule[days[todayNight.weekday - 1]].night.time.minutes =
      todayNight.minute;

    // Set tomorrow morning in schedule
    const tomorrowMorning = DateTime.fromISO(testData.tomorrowMorning);
    settings.schedule[days[tomorrowMorning.weekday - 1]].day.time.hours =
      tomorrowMorning.hour;
    settings.schedule[days[tomorrowMorning.weekday - 1]].day.time.minutes =
      tomorrowMorning.minute;

    const now = DateTime.fromISO(testData.currentTime);
    const state = getClockState(settings, now);

    assert.equal(state.currentMode, testData.expectedMode);
    assert.equal(
      state.previousTransition.equals(
        DateTime.fromISO(testData.expectedPreviousTransition),
      ),
      true,
    );
    assert.equal(
      state.nextTransition.equals(
        DateTime.fromISO(testData.expectedNextTransition),
      ),
      true,
    );
  });
}

type ClockStateWithOverrideTest = ClockStateTest & {
  yesterdayDay: string;
  overrideSetAt: string;
  overrideTime: string;
  expectedOverride: boolean;
};

const clockStateWithOverrideTests: ClockStateWithOverrideTest[] = [
  {
    name: 'override set yesterday morning',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-09T08:59:00',
    overrideTime: '2022-01-10T09:30:00',

    currentTime: '2022-01-10T08:59:00',

    expectedPreviousTransition: '2022-01-09T20:00:00',
    expectedNextTransition: '2022-01-10T09:00:00',
    expectedMode: 'night',
    expectedOverride: false,
  },
  {
    name: 'override set yesterday day',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-09T19:59:00',
    overrideTime: '2022-01-10T10:00:00',

    currentTime: '2022-01-10T09:30:00',

    expectedPreviousTransition: '2022-01-09T20:00:00',
    expectedNextTransition: '2022-01-10T10:00:00',
    expectedMode: 'night',
    expectedOverride: true,
  },
  {
    name: 'override set yesterday night',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-09T20:01:00',
    overrideTime: '2022-01-10T10:00:00',

    currentTime: '2022-01-10T09:30:00',

    expectedPreviousTransition: '2022-01-09T20:00:00',
    expectedNextTransition: '2022-01-10T10:00:00',
    expectedMode: 'night',
    expectedOverride: true,
  },
  {
    name: 'override set this morning',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-10T08:59:00',
    overrideTime: '2022-01-10T09:30:00',

    currentTime: '2022-01-10T09:15:00',

    expectedPreviousTransition: '2022-01-09T20:00:00',
    expectedNextTransition: '2022-01-10T09:30:00',
    expectedMode: 'night',
    expectedOverride: true,
  },
  {
    name: 'override set this morning, but has already occurred',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-10T08:59:00',
    overrideTime: '2022-01-10T09:30:00',

    currentTime: '2022-01-10T09:31:00',

    expectedPreviousTransition: '2022-01-10T09:30:00',
    expectedNextTransition: '2022-01-10T20:00:00',
    expectedMode: 'day',
    expectedOverride: false,
  },
  {
    name: 'override set today for tomorrow morning',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-10T11:00:00',
    overrideTime: '2022-01-11T09:30:00',

    currentTime: '2022-01-10T12:00:00',

    expectedPreviousTransition: '2022-01-10T09:00:00',
    expectedNextTransition: '2022-01-10T20:00:00',
    expectedMode: 'day',
    expectedOverride: true,
  },
  {
    name: 'override set tonight for tomorrow morning',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-10T20:01:00',
    overrideTime: '2022-01-11T09:30:00',

    currentTime: '2022-01-10T20:30:00',

    expectedPreviousTransition: '2022-01-10T20:00:00',
    expectedNextTransition: '2022-01-11T09:30:00',
    expectedMode: 'night',
    expectedOverride: true,
  },
  {
    name: 'override set this morning, but has already occurred and it is now night',

    yesterdayDay: '2022-01-09T09:00:00',
    yesterdayNight: '2022-01-09T20:00:00',
    todayMorning: '2022-01-10T09:00:00',
    todayNight: '2022-01-10T20:00:00',
    tomorrowMorning: '2022-01-11T09:00:00',

    overrideSetAt: '2022-01-10T08:59:00',
    overrideTime: '2022-01-10T09:30:00',

    currentTime: '2022-01-10T20:30:00',

    expectedPreviousTransition: '2022-01-10T20:00:00',
    expectedNextTransition: '2022-01-11T09:00:00',
    expectedMode: 'night',
    expectedOverride: false,
  },
];

for (const testData of clockStateWithOverrideTests) {
  // eslint-disable-next-line @typescript-eslint/no-loop-func
  test(`${testData.name}`, (t) => {
    // Set Yesterday day in schedule
    const yesterdayDay = DateTime.fromISO(testData.yesterdayDay);
    settings.schedule[days[yesterdayDay.weekday - 1]].day.time.hours =
      yesterdayDay.hour;
    settings.schedule[days[yesterdayDay.weekday - 1]].day.time.minutes =
      yesterdayDay.minute;

    // Set Yesterday night in schedule
    const yesterdayNight = DateTime.fromISO(testData.yesterdayNight);
    settings.schedule[days[yesterdayNight.weekday - 1]].night.time.hours =
      yesterdayNight.hour;
    settings.schedule[days[yesterdayNight.weekday - 1]].night.time.minutes =
      yesterdayNight.minute;

    // Set today morning in schedule
    const todayMorning = DateTime.fromISO(testData.todayMorning);
    settings.schedule[days[todayMorning.weekday - 1]].day.time.hours =
      todayMorning.hour;
    settings.schedule[days[todayMorning.weekday - 1]].day.time.minutes =
      todayMorning.minute;

    // Set today night in schedule
    const todayNight = DateTime.fromISO(testData.todayNight);
    settings.schedule[days[todayNight.weekday - 1]].night.time.hours =
      todayNight.hour;
    settings.schedule[days[todayNight.weekday - 1]].night.time.minutes =
      todayNight.minute;

    // Set tomorrow morning in schedule
    const tomorrowMorning = DateTime.fromISO(testData.tomorrowMorning);
    settings.schedule[days[tomorrowMorning.weekday - 1]].day.time.hours =
      tomorrowMorning.hour;
    settings.schedule[days[tomorrowMorning.weekday - 1]].day.time.minutes =
      tomorrowMorning.minute;

    // Set Override in settings
    const overrideSetAt = DateTime.fromISO(testData.overrideSetAt);
    settings.override.setAt = overrideSetAt.toISO()!;
    const overrideTime = DateTime.fromISO(testData.overrideTime);
    settings.override.transition.time.hours = overrideTime.hour;
    settings.override.transition.time.minutes = overrideTime.minute;

    const now = DateTime.fromISO(testData.currentTime);
    const state = getClockState(settings, now);

    assert.equal(state.currentMode, testData.expectedMode);
    assert.equal(
      state.previousTransition.equals(
        DateTime.fromISO(testData.expectedPreviousTransition),
      ),
      true,
    );
    assert.equal(
      state.nextTransition.equals(
        DateTime.fromISO(testData.expectedNextTransition),
      ),
      true,
    );
  });
}
