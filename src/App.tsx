import {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';

type ClockMode = 'day' | 'night';

const night = {hours: 20, minutes: 0};
const day = {hours: 8, minutes: 0};

function toMinutes(hours: number, minutes: number): number {
  const total = hours * 60 + minutes;
  return total;
}

const dayMinutes = toMinutes(day.hours, day.minutes);
const nightMinutes = toMinutes(night.hours, night.minutes);

const minutesPerDay = 60 * 24;

function normalizeToDay(totalMinutes: number): number {
  return (totalMinutes + minutesPerDay - dayMinutes) % minutesPerDay;
}

const nightNormalizedMinutes = normalizeToDay(nightMinutes);

function App() {
  const [time, setTime] = useState(new Date());

  const normalizedTime = normalizeToDay(
    toMinutes(time.getHours(), time.getMinutes()),
  );
  const clockMode: ClockMode =
    normalizedTime < nightNormalizedMinutes ? 'day' : 'night';
  const percentComplete =
    ((clockMode === 'day'
      ? normalizedTime
      : normalizedTime - nightNormalizedMinutes) *
      100) /
    (clockMode === 'day'
      ? nightNormalizedMinutes
      : minutesPerDay - nightNormalizedMinutes);

  console.log('p', percentComplete);

  useEffect(() => {
    const handle = setInterval(() => {
      const nextTime = new Date();
      setTime(nextTime);
    }, 1000);

    return () => {
      clearTimeout(handle);
    };
  });

  // Const transition = useCallback(() => {
  //   console.log('transition', clockMode);
  //   setClockMode(clockMode === 'day' ? 'night' : 'day');
  // }, [clockMode]);

  // const keyHandlers = useMemo(
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
        'items-center gap-10vh align-start w-full transition transition-all duration-1000 ease-linear select-none',
        clockMode === 'night' && 'bg-black',
        clockMode === 'day' && 'bg-blue-6',
        // ClockMode === 'day' && 'bg-gradient-to-t from-orange-6 to-blue-6',
        // clockMode === 'night' && 'bg-gradient-to-t from-pink-6 to-black'
      )}
      // OnClick={transition}
    >
      <div className="h-60vh p-2 aspect-square box-border">
        <div className="w-full h-full relative">
          <div
            className={clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-yellow i-pixelarticons-sun-alt',
              clockMode === 'day'
                ? 'animate-bounce-in-up'
                : 'animate-bounce-out-up',
            )}
          />
          <div
            className={clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-pink-3 i-pixelarticons-moon-star',
              clockMode === 'night'
                ? 'animate-bounce-in-up'
                : 'animate-bounce-out-up',
            )}
          />
        </div>
      </div>
      <div className="h-30vh w-full relative">
        <div className="leading-none text-20vh pb-1vh self-center font-mono">
          {time.getHours()}:{time.getMinutes().toString().padStart(2, '0')}
        </div>
        <div
          className={clsx(
            'w-100vw h-10vh transition-all duration-500 ease-out',
            clockMode === 'day' && 'bg-yellow',
            clockMode === 'night' && 'bg-pink-3',
          )}
          style={{width: `${percentComplete}%`}}
        />
        <div className="absolute bottom-0 left-0 font-mono text-10vh leading-none pr-2 mix-blend-difference">
          {(clockMode === 'day' ? day : night).hours
            .toString()
            .padStart(2, '0')}
          :
          {(clockMode === 'day' ? day : night).minutes
            .toString()
            .padStart(2, '0')}
        </div>
        <div className="absolute bottom-0 right-0 font-mono text-10vh leading-none pr-2 mix-blend-difference">
          {(clockMode === 'day' ? night : day).hours
            .toString()
            .padStart(2, '0')}
          :
          {(clockMode === 'day' ? night : day).minutes
            .toString()
            .padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

export default App;
