import {DateTime, type DateTimeMaybeValid} from 'luxon';
import {type ClockState, type Day, type Settings} from './schedule.types.ts';

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
  referenceTime: DateTimeMaybeValid,
): ClockStateDateTime {
  // Keep TypeScript happy with luxon 😢
  if (!referenceTime.isValid) {
    throw new Error(referenceTime.invalidExplanation ?? 'Invalid date');
  }

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
  const overrideTime = referenceTime.set({
    hour: override.transition.time.hours,
    minute: override.transition.time.minutes,
    second: 0,
    millisecond: 0,
  });

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
    if (overrideSetAt < todayDay && referenceTime < overrideTime) {
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

    // Override set today, but has already ocurred
    return {
      nextTransition: todayNight,
      nextMode: 'night',
      currentMode: 'day',
      previousTransition: overrideTime,
      isOverrideActive: false,
    };
  }

  if (
    // Override set yesterday
    overrideSetAt.hasSame(referenceTime.minus({days: 1}), 'day') &&
    // After the yesterday day?
    overrideSetAt > yesterdayDay && // Override is in the future?
    overrideTime > referenceTime
  ) {
    return {
      nextTransition: overrideTime,
      nextMode: 'day',
      currentMode: 'night',
      previousTransition: yesterdayDay,
      isOverrideActive: true,
    };
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

  // Before today's night
  if (referenceTime < todayNight) {
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
