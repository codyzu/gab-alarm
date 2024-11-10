import {type ClockState, type Day, type Settings} from 'shared';
import {DateTime} from 'luxon';

// Replace the datetime strings with luxon DateTime objects
export type ClockStateDateTime = Omit<
  ClockState,
  'nextTransition' | 'previousTransition'
> & {
  nextTransition: DateTime;
  previousTransition: DateTime;
};

export function getClockState(settings: Settings) {
  const override = settings.override;
  const overrideSetAt = DateTime.fromISO(override.setAt);

  const now = DateTime.now();
  const yesterday = now.minus({days: 1});

  const todaySchedule = settings.schedule[now.weekdayLong.toLowerCase() as Day];
  const yesterdaySchedule =
    settings.schedule[yesterday.weekdayLong.toLowerCase() as Day];
  const tomorrowSchedule =
    settings.schedule[now.plus({days: 1}).weekdayLong.toLowerCase() as Day];

  const todayDay = now.set({
    hour: todaySchedule.day.time.hours,
    minute: todaySchedule.day.time.minutes,
    second: 0,
    millisecond: 0,
  });
  const todayNight = now.set({
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
  const tomorrowDay = now.plus({days: 1}).set({
    hour: tomorrowSchedule.day.time.hours,
    minute: tomorrowSchedule.day.time.minutes,
    second: 0,
    millisecond: 0,
  });

  let clockState: ClockStateDateTime | undefined;

  if (overrideSetAt.hasSame(now, 'day')) {
    if (overrideSetAt > todayDay) {
      // Set after todays day?
      // Override tomorrow morning
      if (now > todayNight) {
        clockState = {
          nextTransition: now.plus({days: 1}).set({
            hour: override.transition.time.hours,
            minute: override.transition.time.minutes,
            second: 0,
            millisecond: 0,
          }),
          nextMode: 'day',
          currentMode: 'night',
          previousTransition: todayNight,
        };
      }
    } else {
      // Set before todays day?
      // Override this morning
      clockState = {
        nextTransition: now.set({
          hour: override.transition.time.hours,
          minute: override.transition.time.minutes,
          second: 0,
          millisecond: 0,
        }),
        nextMode: 'day',
        currentMode: 'night',
        previousTransition: yesterdayNight,
      };
    }
  } else if (
    // Override set yesterday
    overrideSetAt.hasSame(now.minus({days: 1}), 'day') &&
    // After the yesterday day?
    overrideSetAt > yesterdayDay
  ) {
    const overrideTime = now.set({
      hour: override.transition.time.hours,
      minute: override.transition.time.minutes,
      second: 0,
      millisecond: 0,
    });

    // Override is in the future?
    if (overrideTime > now) {
      clockState = {
        nextTransition: overrideTime,
        nextMode: 'day',
        currentMode: 'night',
        previousTransition: yesterdayDay,
      };
    }
  }

  // No override
  if (clockState === undefined) {
    if (now < todayDay) {
      // Before today's day
      clockState = {
        nextTransition: todayDay,
        nextMode: 'day',
        previousTransition: yesterdayNight,
        currentMode: 'night',
      };
    } else if (now < todayNight) {
      // Before today's night
      clockState = {
        nextTransition: todayNight,
        nextMode: 'night',
        previousTransition: todayDay,
        currentMode: 'day',
      };
    } else {
      // After today's night
      clockState = {
        nextTransition: tomorrowDay,
        nextMode: 'day',
        previousTransition: todayNight,
        currentMode: 'night',
      };
    }
  }

  return clockState;
}
