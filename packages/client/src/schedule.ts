import {useEffect, useState} from 'react';
import {
  settingsSchema,
  type Settings,
  days,
  dateToMinutes,
  timeToMinutes,
  type ClockMode,
  type Time,
  type DaySchedule,
  type WeekSchedule,
} from '../../shared/schedule.types.ts';
import {defaultSettings} from './default-settings';

export async function getSettings(): Promise<Settings> {
  const response = await fetch('/schedule');
  const data: unknown = await response.json();

  try {
    return settingsSchema.parse(data);
  } catch (error) {
    console.error(error);
    console.error('Loading default settings');
    return defaultSettings;
  }
}

export async function putSettings(settings: Settings) {
  const result = await fetch('/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!result.ok) {
    console.error(result);
    throw new Error('Unable to save settings.');
  }
}

export function isOverrideEnabled(settings: Settings, now: Date) {
  return applyOverride(settings, now).override;
}

const minutesPerDay = 60 * 24;

function applyOverride(
  settings: Settings,
  now: Date,
): {override: boolean; schedule: WeekSchedule} {
  function getScheduleForDate(date: Date): DaySchedule {
    const dateDayName = days[(date.getDay() - 1 + 7) % 7];
    return settings.schedule[dateDayName];
  }

  const todayName = days[(now.getDay() - 1 + 7) % 7];
  const tomorrowName = days[now.getDay() - 1 + 1];
  const todaySchedule = getScheduleForDate(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  // Note, this is not yesterday in days of the week, but yesterday as in the exact date for calculating the override
  const yesterdaySchedule = getScheduleForDate(yesterdayDate);

  const sched = {...settings.schedule};
  const overrideDate = new Date(settings.override.setAt);
  const overrideSetAtMinutes = dateToMinutes(overrideDate);

  let override = false;

  // Was the override set today or yesterday?
  if (
    // Override set today
    overrideDate.getFullYear() === now.getFullYear() &&
    overrideDate.getMonth() === now.getMonth() &&
    overrideDate.getDate() === now.getDate()
  ) {
    override = true;
    if (overrideSetAtMinutes > timeToMinutes(todaySchedule.day.time)) {
      // Set after todays day?
      // Override tomorrow morning
      sched[tomorrowName] = {
        ...settings.schedule[tomorrowName],
        day: settings.override.transition,
      };
    } else {
      // Set before todays day?
      // Override this morning
      sched[todayName] = {
        ...settings.schedule[todayName],
        day: settings.override.transition,
      };
    }
  } else if (
    // Override set yesterday
    overrideDate.getFullYear() === yesterdayDate.getFullYear() &&
    overrideDate.getMonth() === yesterdayDate.getMonth() &&
    overrideDate.getDate() === yesterdayDate.getDate() &&
    // After the yesterday day?
    overrideSetAtMinutes > timeToMinutes(yesterdaySchedule.day.time) &&
    // Override is in the future?
    timeToMinutes(settings.override.transition.time) > dateToMinutes(now)
  ) {
    override = true;
    // Override this morning
    sched[todayName] = {
      ...settings.schedule[todayName],
      day: settings.override.transition,
    };
  }

  return {override, schedule: sched};
}

export function useFunctionalSchedule(now: Date, settings: Settings) {
  const {schedule: sched} = applyOverride(settings, now);

  const todayName = days[(now.getDay() - 1 + 7) % 7];
  const yesterdayName = days[(now.getDay() - 1 + 7 - 1) % 7];
  const tomorrowName = days[now.getDay() - 1 + 1];

  const today = sched[todayName];
  const yesterday = sched[yesterdayName];
  const tomorrow = sched[tomorrowName];

  const nowMinutes = dateToMinutes(now);
  const todayDayMinutes = timeToMinutes(today.day.time);
  const todayNightMinutes = timeToMinutes(today.night.time);

  let lowerLimit: Time;
  let lowerLimitMinutes: number;
  let upperLimit: Time;
  let upperLimitMinutes: number;
  let sound: boolean;

  if (nowMinutes < todayDayMinutes) {
    // Before today morning
    lowerLimit = yesterday.night.time;
    lowerLimitMinutes = timeToMinutes(yesterday.night.time);
    upperLimit = today.day.time;
    upperLimitMinutes = timeToMinutes(today.day.time) + minutesPerDay;
    sound = yesterday.night.sound;
  } else if (nowMinutes < todayNightMinutes) {
    // Before today night
    lowerLimit = today.day.time;
    lowerLimitMinutes = timeToMinutes(today.day.time) + minutesPerDay;
    upperLimit = today.night.time;
    upperLimitMinutes = timeToMinutes(today.night.time) + minutesPerDay;
    sound = today.day.sound;
  } else {
    // After today night
    lowerLimit = today.night.time;
    lowerLimitMinutes = timeToMinutes(today.night.time) + minutesPerDay;
    upperLimit = tomorrow.day.time;
    upperLimitMinutes = timeToMinutes(tomorrow.day.time) + minutesPerDay * 2;
    sound = today.night.sound;
  }

  const clockMode: ClockMode =
    nowMinutes < todayDayMinutes || nowMinutes >= todayNightMinutes
      ? 'night'
      : 'day';

  const percent =
    ((nowMinutes + minutesPerDay - lowerLimitMinutes) * 100) /
    (upperLimitMinutes - lowerLimitMinutes);

  return {
    clockMode,
    upperLimit,
    // Probably won't display lower limit, so this can be removed and deleted from the calculations above
    lowerLimit,
    percent,
    sound,
  };
}

export function usePolledSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Poll settings at an interval
  useEffect(() => {
    let cancel = false;

    async function loadSettings() {
      const nextSettings = await getSettings();

      if (cancel) {
        return;
      }

      setSettings(nextSettings);
    }

    // Load on first mount
    void loadSettings();

    // Poll every 5 seconds
    const handle = setInterval(loadSettings, 5000);

    return () => {
      cancel = true;
      clearInterval(handle);
    };
  }, []);

  return settings;
}
