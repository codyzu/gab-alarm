import {type Transition, type Time} from '../../shared/schedule.types';
import TransitionControl from './TransitionControl';

export default function DayControl({
  dayName,
  night,
  setNightTime,
  setNightSound,
  day,
  setDayTime,
  setDaySound,
}: {
  readonly dayName: string;
  readonly night: Transition;
  readonly day: Transition;
  readonly setNightTime: (nextTime: Time) => void;
  readonly setNightSound: (playSound: boolean) => void;
  readonly setDayTime: (nextTime: Time) => void;
  readonly setDaySound: (playSound: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-subgrid col-span-2">
      <div className="col-span-2 text-2xl font-bold">{dayName}</div>
      <div className="grid grid-cols-subgrid col-span-2 row-span-2 gap-y-1">
        <TransitionControl
          label="Wakeup"
          time={day}
          setTime={setDayTime}
          isSoundEnabled={day.sound}
          setSound={setDaySound}
        />
        <TransitionControl
          label="Sleep"
          time={night}
          setTime={setNightTime}
          isSoundEnabled={night.sound}
          setSound={setNightSound}
        />
      </div>
    </div>
  );
}
