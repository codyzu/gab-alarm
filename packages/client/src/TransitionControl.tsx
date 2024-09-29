import {type Time} from 'shared';

function timeStringToTime(time: string) {
  return {
    hours: Number.parseInt(time.split(':')[0]!, 10),
    minutes: Number.parseInt(time.split(':')[1]!, 10),
  };
}

export default function TransitionControl({
  label,
  time,
  sound,
  setTime,
  setSound,
}: {
  readonly label: string;
  readonly time: Time;
  readonly setTime: (time: Time) => void;
  readonly sound: boolean;
  readonly setSound: (sound: boolean) => void;
}) {
  return (
    <>
      <label className="grid grid-cols-subgrid col-span-2 gap-x-4">
        <div className="justify-self-end">{label} time</div>
        <input
          className="text-black rounded text-center focus:outline-green justify-self-start px-2"
          type="time"
          value={`${time.hours.toString().padStart(2, '0')}:${time.minutes
            .toString()
            .padStart(2, '0')}`}
          onChange={(event) => {
            setTime(timeStringToTime(event.target.value));
          }}
        />
      </label>
      <label className="grid grid-cols-subgrid col-span-2 gap-x-4">
        <div className="justify-self-end">{label} sound</div>
        <input
          className="focus:outline-green justify-self-start h-full aspect-square"
          type="checkbox"
          checked={sound}
          onChange={(event) => {
            setSound(event.target.checked);
          }}
        />
      </label>
    </>
  );
}
