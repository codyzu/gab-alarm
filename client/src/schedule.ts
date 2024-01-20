import {useCallback, useEffect, useState} from 'react';
import {
  settingsSchema,
  type Settings,
  type Day,
  type When,
  days,
  dateToMinutes,
  timeToMinutes,
  type ClockMode,
  type Time,
  type DaySchedule,
  type WeekSchedule,
} from './schedule.types';
import {defaultSettings} from './default-settings';

async function getSettings(): Promise<Settings> {
  const response = await fetch('/schedule');
  const data: unknown = await response.json();

  // Throws if the data is invalid, resulting in the default schedule in the state
  return settingsSchema.parse(data);
}

async function putSettings(settings: Settings) {
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

export function useRawSchedule() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    let cancel = false;

    async function loadSettings() {
      const nextSettings = await getSettings();

      if (cancel) {
        return;
      }

      setSettings(nextSettings);
    }

    void loadSettings();

    return () => {
      cancel = true;
    };
  }, []);

  const saveSettings = useCallback(async () => {
    await putSettings(settings);
  }, [settings]);

  const setScheduleTransition = useCallback(
    (time: Time, day: Day, when: When) => {
      setSettings((currentSettings) => {
        return {
          ...currentSettings,
          schedule: {
            ...currentSettings.schedule,
            [day]: {
              ...currentSettings.schedule[day],
              [when]: {
                ...currentSettings.schedule[day][when],
                ...time,
              },
            },
          },
        };
      });
    },
    [],
  );

  const setScheduleSound = useCallback(
    (sound: boolean, day: Day, when: When) => {
      setSettings((currentSettings) => {
        return {
          ...currentSettings,
          schedule: {
            ...currentSettings.schedule,
            [day]: {
              ...currentSettings.schedule[day],
              [when]: {
                ...currentSettings.schedule[day][when],
                sound,
              },
            },
          },
        };
      });
    },
    [],
  );

  const setOverrideTime = useCallback((time: Time) => {
    setSettings((currentSettings) => {
      return {
        ...currentSettings,
        override: {
          ...currentSettings.override,
          transition: {
            ...currentSettings.override.transition,
            ...time,
          },
          setAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const setOverrideSound = useCallback((sound: boolean) => {
    setSettings((currentSettings) => {
      return {
        ...currentSettings,
        override: {
          ...currentSettings.override,
          transition: {
            ...currentSettings.override.transition,
            sound,
          },
          setAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const resetOverride = useCallback(() => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      override: {
        ...currentSettings.override,
        setAt: defaultSettings.override.setAt,
      },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const {override} = applyOverride(settings, new Date());

  return {
    settings,
    saveSettings,
    setScheduleTransition,
    setScheduleSound,
    setOverrideTime,
    setOverrideSound,
    resetToDefaults,
    override,
    resetOverride,
  };
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
    if (overrideSetAtMinutes > timeToMinutes(todaySchedule.day)) {
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
    overrideSetAtMinutes > timeToMinutes(yesterdaySchedule.day)
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
  const todayDayMinutes = timeToMinutes(today.day);
  const todayNightMinutes = timeToMinutes(today.night);

  let lowerLimit: Time;
  let lowerLimitMinutes: number;
  let upperLimit: Time;
  let upperLimitMinutes: number;
  let sound: boolean;

  if (nowMinutes < todayDayMinutes) {
    // Before today morning
    lowerLimit = yesterday.night;
    lowerLimitMinutes = timeToMinutes(yesterday.night);
    upperLimit = today.day;
    upperLimitMinutes = timeToMinutes(today.day) + minutesPerDay;
    sound = yesterday.night.sound;
  } else if (nowMinutes < todayNightMinutes) {
    // Before today night
    lowerLimit = today.day;
    lowerLimitMinutes = timeToMinutes(today.day) + minutesPerDay;
    upperLimit = today.night;
    upperLimitMinutes = timeToMinutes(today.night) + minutesPerDay;
    sound = today.day.sound;
  } else {
    // After today night
    lowerLimit = today.night;
    lowerLimitMinutes = timeToMinutes(today.night) + minutesPerDay;
    upperLimit = tomorrow.day;
    upperLimitMinutes = timeToMinutes(tomorrow.day) + minutesPerDay * 2;
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

  // Load the settings on on mount
  useEffect(() => {
    let cancel = false;

    async function loadSettings() {
      const nextSettings = await getSettings();

      if (cancel) {
        return;
      }

      setSettings(nextSettings);
    }

    void loadSettings();

    return () => {
      cancel = true;
    };
  }, []);

  // Poll settings at an interval
  useEffect(() => {
    let cancel = false;
    const handle = setInterval(async () => {
      const nextSettings = await getSettings();

      if (cancel) {
        return;
      }

      setSettings(nextSettings);
    }, 5000);

    return () => {
      cancel = true;
      clearInterval(handle);
    };
  }, []);

  return settings;
}
