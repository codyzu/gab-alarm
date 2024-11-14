import {DateTime} from 'luxon';
import {type ClockState, type Day, type Settings} from './schedule.types.js';

// Replace the datetime strings with luxon DateTime objects
export type ClockStateDateTime = Omit<
  ClockState,
  'nextTransition' | 'previousTransition'
> & {
  nextTransition: DateTime;
  previousTransition: DateTime;
};

export function getClockState(
  settings: Settings,
  referenceTime: DateTime<true>,
): ClockStateDateTime {
  const override = settings.override;
  const overrideSetAt = DateTime.fromISO(override.setAt);

  const yesterday = referenceTime.minus({days: 1});

  const todaySchedule =
    settings.schedule[referenceTime.weekdayLong.toLowerCase() as Day];
  const yesterdaySchedule =
    settings.schedule[yesterday.weekdayLong.toLowerCase() as Day];
  const tomorrowSchedule =
    settings.schedule[
      referenceTime.plus({days: 1}).weekdayLong.toLowerCase() as Day
    ];

  const todayDay = referenceTime.set({
    hour: todaySchedule.day.time.hours,
    minute: todaySchedule.day.time.minutes,
    second: 0,
    millisecond: 0,
  });
  const todayNight = referenceTime.set({
    hour: todaySchedule.night.time.hours,
    minute: todaySchedule.night.time.minutes,
    second: 0,
    millisecond: 0,
  });
  const yesterdayDay = yesterday.set({
    hour: yesterdaySchedule.day.time.hours,
    minute: yesterdaySchedule.day.time.minutes,
    second: 0,
    millisecond: 0,
  });
  const yesterdayNight = yesterday.set({
    hour: yesterdaySchedule.night.time.hours,
    minute: yesterdaySchedule.night.time.minutes,
    second: 0,
    millisecond: 0,
  });
  const tomorrowDay = referenceTime.plus({days: 1}).set({
    hour: tomorrowSchedule.day.time.hours,
    minute: tomorrowSchedule.day.time.minutes,
    second: 0,
    millisecond: 0,
  });

  let clockState: ClockStateDateTime | undefined;

  // Override set today
  if (overrideSetAt.hasSame(referenceTime, 'day')) {
    if (
      // Set after todays day?
      overrideSetAt > todayDay &&
      // Today's day already passed?
      referenceTime > todayNight
    ) {
      // Override tomorrow morning
      return {
        nextTransition: referenceTime.plus({days: 1}).set({
          hour: override.transition.time.hours,
          minute: override.transition.time.minutes,
          second: 0,
          millisecond: 0,
        }),
        nextMode: 'day',
        currentMode: 'night',
        previousTransition: todayNight,
        isOverrideActive: true,
      };
    }

    // Override set before todays day?
    // Override today's morning
    return {
      nextTransition: referenceTime.set({
        hour: override.transition.time.hours,
        minute: override.transition.time.minutes,
        second: 0,
        millisecond: 0,
      }),
      nextMode: 'day',
      currentMode: 'night',
      previousTransition: yesterdayNight,
      isOverrideActive: true,
    };
  }

  if (
    // Override set yesterday
    overrideSetAt.hasSame(referenceTime.minus({days: 1}), 'day') &&
    // After the yesterday day?
    overrideSetAt > yesterdayDay
  ) {
    const overrideTime = referenceTime.set({
      hour: override.transition.time.hours,
      minute: override.transition.time.minutes,
      second: 0,
      millisecond: 0,
    });

    // Override is in the future?
    if (overrideTime > referenceTime) {
      return {
        nextTransition: overrideTime,
        nextMode: 'day',
        currentMode: 'night',
        previousTransition: yesterdayDay,
        isOverrideActive: true,
      };
    }
  }

  // No override
  if (referenceTime < todayDay) {
    // Before today's day
    return {
      nextTransition: todayDay,
      nextMode: 'day',
      previousTransition: yesterdayNight,
      currentMode: 'night',
      isOverrideActive: false,
    };
  }

  if (referenceTime < todayNight) {
    // Before today's night
    return {
      nextTransition: todayNight,
      nextMode: 'night',
      previousTransition: todayDay,
      currentMode: 'day',
      isOverrideActive: false,
    };
  }

  // After today's night
  return {
    nextTransition: tomorrowDay,
    nextMode: 'day',
    previousTransition: todayNight,
    currentMode: 'night',
    isOverrideActive: false,
  };
}
