import {type Time} from './schedule.types';

function timeStringToTime(time: string) {
  return {
    hours: Number.parseInt(time.split(':')[0]!, 10),
    minutes: Number.parseInt(time.split(':')[1]!, 10),
  };
}

export default function DayControl({
  dayName,
  night,
  setNight,
  day,
  setDay,
}: {
  readonly dayName: string;
  readonly night: Time;
  readonly day: Time;
  readonly setNight: (nextTime: Time) => void;
  readonly setDay: (nextTime: Time) => void;
}) {
  return (
    <div className="grid grid-cols-subgrid col-span-3">
      <div className="row-span-2">{dayName}</div>
      <div className="grid grid-cols-subgrid col-span-2 row-span-2 gap-y-1">
        <label className="grid grid-cols-subgrid col-span-2">
          <div>Night</div>
          <input
            className="text-black rounded text-center focus:outline-green"
            type="time"
            value={`${night.hours.toString().padStart(2, '0')}:${night.minutes
              .toString()
              .padStart(2, '0')}`}
            onChange={(event) => {
              setNight(timeStringToTime(event.target.value));
            }}
          />
        </label>
        <label className="grid grid-cols-subgrid col-span-2">
          <div>Day</div>
          <input
            className="text-black rounded text-center focus:outline-green"
            type="time"
            value={`${day.hours.toString().padStart(2, '0')}:${day.minutes
              .toString()
              .padStart(2, '0')}`}
            onChange={(event) => {
              setDay(timeStringToTime(event.target.value));
            }}
          />
        </label>
      </div>
    </div>
  );
}
