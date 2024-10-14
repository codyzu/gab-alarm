import {type Time} from 'shared';
import {useController} from 'react-hook-form';

function timeStringToTime(time: string) {
  return {
    hours: Number.parseInt(time.split(':')[0], 10),
    minutes: Number.parseInt(time.split(':')[1], 10),
  };
}

export default function TransitionControl({
  label,
  settingsKey,
  onChange,
}: {
  readonly label: string;
  readonly settingsKey: string;
  readonly onChange?: () => void;
}) {
  const {field: timeField} = useController({
    name: `${settingsKey}.time`,
  });
  const {field: soundField} = useController({
    name: `${settingsKey}.sound`,
  });

  return (
    <>
      <label className="grid grid-cols-subgrid col-span-2 gap-x-4">
        <div className="justify-self-end">{label} time</div>
        <input
          className="text-black rounded text-center focus:outline-green justify-self-start px-2"
          type="time"
          {...timeField}
          value={`${(timeField.value as Time).hours.toString().padStart(2, '0')}:${(
            timeField.value as Time
          ).minutes
            .toString()
            .padStart(2, '0')}`}
          onChange={(event) => {
            timeField.onChange(timeStringToTime(event.target.value));
            onChange?.();
          }}
        />
      </label>
      <label className="grid grid-cols-subgrid col-span-2 gap-x-4">
        <div className="justify-self-end">{label} sound</div>
        <input
          className="focus:outline-green justify-self-start h-full aspect-square"
          type="checkbox"
          {...soundField}
          checked={soundField.value as boolean}
          onChange={(event) => {
            soundField.onChange(event.target.checked);
            onChange?.();
          }}
        />
      </label>
    </>
  );
}
