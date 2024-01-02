import {useEffect, useState} from 'react';
import clsx from 'clsx';
// @ts-expect-error bad package exports
import {useSound} from 'use-sound';
import wake from './assets/rooster.mp3';
import sleep from './assets/cricket.mp3';

type ClockMode = 'day' | 'night';
type Time = {hours: number; minutes: number};
type DaySchedule = {day: Time; night: Time};
type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  tomorrowMorning?: Time;
};
type Day = keyof WeekSchedule;

const defaultSchedule: WeekSchedule = {
  monday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  tuesday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  wednesday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  thursday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  friday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  saturday: {
    day: {hours: 8, minutes: 0},
    night: {hours: 21, minutes: 0},
  },
  sunday: {
    day: {hours: 8, minutes: 0},
    night: {hours: 21, minutes: 0},
  },
};

const days: Day[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function toMinutes(hours: number, minutes: number): number {
  const total = hours * 60 + minutes;
  return total;
}

const minutesPerDay = 60 * 24;

function App() {
  const [time, setTime] = useState(new Date());
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultSchedule);
  const [modeOverride, setModeOverride] = useState<
    {mode: ClockMode; timeoutTimestamp: number} | undefined
  >(undefined);

  const [playWake] = (useSound as (url: any) => [() => void])(wake);
  const [playSleep] = (useSound as (url: any) => [() => void])(sleep);

  const todayName = days[(time.getDay() - 1 + 7) % 7];
  const yesterdayName = days[(time.getDay() - 1 + 7 - 1) % 7];
  const tomorrowName = days[time.getDay() - 1 + 1];
  const today = schedule[todayName] as DaySchedule;
  const yesterday = schedule[yesterdayName] as DaySchedule;
  const tomorrow = schedule[tomorrowName] as DaySchedule;

  const nowMinutes = toMinutes(time.getHours(), time.getMinutes());
  const todayDayMinutes = toMinutes(today.day.hours, today.day.minutes);
  const todayNightMinutes = toMinutes(today.night.hours, today.night.minutes);

  const actualMode: ClockMode =
    nowMinutes < todayDayMinutes || nowMinutes >= todayNightMinutes
      ? 'night'
      : 'day';

  const clockMode: ClockMode = modeOverride?.mode ?? actualMode;

  const [previousMode, setPreviousMode] = useState(clockMode);
  useEffect(() => {
    if (clockMode !== previousMode) {
      setPreviousMode(clockMode);
      if (clockMode === 'day') {
        playWake();
      } else {
        playSleep();
      }
    }
  }, [clockMode, previousMode, playSleep, playWake]);

  let lowerLimit: Time;
  let lowerLimitMinutes: number;
  let upperLimit: Time;
  let upperLimitMinutes: number;

  if (nowMinutes < todayDayMinutes) {
    lowerLimit = yesterday.night;
    lowerLimitMinutes = toMinutes(
      yesterday.night.hours,
      yesterday.night.minutes,
    );
  } else if (nowMinutes < todayNightMinutes) {
    lowerLimit = today.day;
    lowerLimitMinutes =
      toMinutes(today.day.hours, today.day.minutes) + minutesPerDay;
  } else {
    lowerLimit = today.night;
    lowerLimitMinutes =
      toMinutes(today.night.hours, today.night.minutes) + minutesPerDay;
  }

  if (nowMinutes > todayNightMinutes) {
    upperLimit = tomorrow.day;
    upperLimitMinutes =
      toMinutes(tomorrow.night.hours, tomorrow.night.minutes) +
      minutesPerDay * 2;
  } else if (nowMinutes > todayDayMinutes) {
    upperLimit = today.night;
    upperLimitMinutes =
      toMinutes(today.night.hours, today.night.minutes) + minutesPerDay;
  } else {
    upperLimit = today.day;
    upperLimitMinutes =
      toMinutes(today.day.hours, today.day.minutes) + minutesPerDay;
  }

  const percent =
    ((nowMinutes + minutesPerDay - lowerLimitMinutes) * 100) /
    (upperLimitMinutes - lowerLimitMinutes);

  useEffect(() => {
    const handle = setInterval(() => {
      const nextTime = new Date();
      setTime(nextTime);
      if (modeOverride && nextTime.getTime() > modeOverride.timeoutTimestamp) {
        setModeOverride(undefined);
        // PlayBell();
      }
    }, 1000);

    return () => {
      clearInterval(handle);
    };
  }, [modeOverride]);

  useEffect(() => {
    let cancel = false;
    const handle = setInterval(async () => {
      const response = await fetch('/schedule');
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const nextSchedule = (await response.json()) as WeekSchedule;

      if (!cancel) {
        setSchedule(nextSchedule);
      }
    }, 5000);

    return () => {
      cancel = true;
      clearInterval(handle);
    };
  }, []);

  // Const keyHandlers = useMemo(
  //   () =>
  //     new Map([
  //       // ['ArrowLeft', navPrevious],
  //       ['ArrowRight', transition],
  //       // ['Space', navNext],
  //       // ['KeyS', openSpeakerWindow],
  //       // ['KeyR', clearAllReaction],
  //       // ['KeyC', throwConfetti],
  //     ]),
  //   [transition],
  // );

  // useEffect(() => {
  //   function handleKeyDown(event: KeyboardEvent) {
  //     console.log(event.code);
  //     const handler = keyHandlers.get(event.code);
  //     if (handler) {
  //       handler();
  //     }
  //   }

  //   document.addEventListener('keydown', handleKeyDown);

  //   // Don't forget to clean up
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [keyHandlers]);

  return (
    <div
      className={clsx(
        'items-center gap-2dvh align-start h-100dvh w-100dvw transition transition-all duration-1000 ease-linear select-none relative',
        clockMode === 'night' && 'bg-black text-gray-400',
        clockMode === 'day' && 'bg-black',
        // ClockMode === 'day' && 'bg-gradient-to-t from-orange-6 to-blue-6',
        // clockMode === 'night' && 'bg-gradient-to-t from-pink-6 to-black'
      )}
      onClick={() => {
        const mode = clockMode === 'day' ? 'night' : 'day';
        setModeOverride({
          mode,
          timeoutTimestamp: time.getTime() + 7000,
        });

        if (mode === 'day') {
          playWake();
        } else {
          playSleep();
        }
      }}
    >
      <div
        className={clsx(
          'absolute top-2dvh h-96dvh aspect-square max-w-96dvh rounded-full',
          'bg-gradient-conic bg-gradient-to-black to-0%',
          `from-${Math.round(percent)}%`,
          clockMode === 'day' && 'bg-gradient-from-yellow',
          clockMode === 'night' && 'bg-gradient-from-sky-800',
        )}
      >
        <div className="w-full h-full bg-gradient-radial bg-gradient-from-black from-96% bg-gradient-shape-[closest-side] bg-gradient-to-transparent to-97%">
          <progress
            value={Math.round(percent)}
            max={100}
            className="hidden w-none h-none"
          />
        </div>
      </div>
      <div
        className={clsx(
          'absolute top-2dvh right-2dvh h-24dvh w-24dvh animate-fill-forwards',
          clockMode === 'day'
            ? 'animate-bounce-in-up'
            : 'animate-bounce-out-up',
        )}
      >
        <div className="i-fluent-emoji-sun-with-face w-full h-full animate-longtada" />
      </div>
      <div
        className={clsx(
          'absolute top-2dvh right-2dvh h-24dvh w-24dvh animate-fill-forwards',
          clockMode === 'night'
            ? 'animate-bounce-in-up'
            : 'animate-bounce-out-up',
        )}
      >
        <div className="i-fluent-emoji-full-moon-face w-full h-full animate-longtada" />
      </div>
      <div className="h-68dvh p-2 aspect-square box-border relative">
        <div className="w-full h-full relative">
          <div
            className={clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-yellow i-fluent-emoji-rooster',
              clockMode === 'day'
                ? 'animate-bounce-in-up'
                : 'animate-bounce-out-up',
            )}
          />
          <div
            className={clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-pink-3 i-fluent-emoji-sloth',
              clockMode === 'night'
                ? 'animate-bounce-in-up'
                : 'animate-bounce-out-up',
            )}
          />
        </div>
      </div>
      <div className="h-30dvh w-full relative">
        <div className="leading-none text-20dvh pb-1dvh self-center font-mono">
          {time.getHours()}:{time.getMinutes().toString().padStart(2, '0')}
        </div>
        <div className="absolute bottom-0 left-0 font-mono text-10dvh leading-none pr-2 mix-blend-difference">
          {lowerLimit.hours.toString().padStart(2, '0')}:
          {lowerLimit.minutes.toString().padStart(2, '0')}
        </div>
        <div className="absolute bottom-0 right-0 font-mono text-10dvh leading-none pr-2 mix-blend-difference flex-row items-center gap-0 justify-end">
          <div
            className={clsx(
              'h-7dvh aspect-square',
              clockMode === 'night' && 'i-fluent-emoji-sun-with-face',
              clockMode === 'day' && 'i-fluent-emoji-full-moon-face',
            )}
          />
          {upperLimit.hours.toString().padStart(2, '0')}:
          {upperLimit.minutes.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

export default App;
