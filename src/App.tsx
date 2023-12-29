import { useCallback, useEffect, useMemo, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import clsx from 'clsx'

type ClockMode = 'day' | 'night';

function App() {
  const [clockMode, setClockMode] = useState<ClockMode>('day');

  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const handle = setInterval(() => {
      setTime(new Date());
    }, 200);

    return () => {
      clearTimeout(handle);
    }
  })

  const transition = useCallback(() => {
    console.log('transition', clockMode)
    setClockMode(clockMode === 'day' ? 'night' : 'day')
  }, [clockMode])

  const keyHandlers = useMemo(
    () =>
      new Map([
        // ['ArrowLeft', navPrevious],
        ['ArrowRight', transition],
        // ['Space', navNext],
        // ['KeyS', openSpeakerWindow],
        // ['KeyR', clearAllReaction],
        // ['KeyC', throwConfetti],
      ]),
    [transition],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      console.log(event.code);
      const handler = keyHandlers.get(event.code);
      if (handler) {
        handler();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyHandlers]);


  const width = (time.getSeconds() * 100 / 60)

  return (
    <div className={
      clsx(
        'items-center gap-10vh align-start w-full transition transition-all duration-1000 ease-linear',
        clockMode === 'night' && 'bg-black',
        clockMode === 'day' && 'bg-blue-6'
        // clockMode === 'day' && 'bg-gradient-to-t from-orange-6 to-blue-6',
        // clockMode === 'night' && 'bg-gradient-to-t from-pink-6 to-black'
        )}>
      <div className='h-70vh p-2 aspect-square box-border'>
        <div className='w-full h-full relative'>
          <div className={
            clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-yellow i-pixelarticons-sun-alt',
              clockMode === 'day' ? 'animate-bounce-in-up' : 'animate-bounce-out-up'
            )} />
          <div className={
            clsx(
              'animate-fill-forwards absolute top-0 left-0 h-full w-full animate-duration-2000 text-pink-3 i-pixelarticons-moon-star',
              clockMode === 'night' ? 'animate-bounce-in-up' : 'animate-bounce-out-up'
              )} />
        </div>
      </div>
      {/* <div className='i-pixelarticons-moon-star h-60vh w-60vh' /> */}
      <div className='h-20vh w-full relative'>
        <div className='leading-none text-14vh pb-1vh self-center font-mono'>{time.getHours()}:{time.getMinutes()}</div>
        <div className={clsx('w-100vw h-5vh transition-all duration-500 ease-out', clockMode === 'day' && 'bg-yellow', clockMode === 'night' && 'bg-pink-3')} style={{width: `${width}%`}} />
        <div className='absolute bottom-0 right-0 font-mono text-5vh leading-none pr-2 mix-blend-difference'>20:00</div>
      </div>
    </div>
  )
}

export default App
