import {type ClockMode, type Time} from 'shared';
import {useController} from 'react-hook-form';
import clsx from 'clsx';

function timeStringToTime(time: string) {
  return {
    hours: Number.parseInt(time.split(':')[0], 10),
    minutes: Number.parseInt(time.split(':')[1], 10),
  };
}

export default function TransitionControl({
  transitionMode,
  settingsKey,
  onChange,
}: {
  readonly transitionMode: ClockMode;
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
        <div className="justify-self-end flex flex-row items-center gap-2">
          {transitionMode === 'day' ? 'Wakeup' : 'Bedtime'} time
          <div
            className={clsx(
              'h-8 w-8',
              transitionMode === 'day'
                ? 'i-fluent-emoji-sun-with-face'
                : 'i-fluent-emoji-full-moon-face',
            )}
          />
        </div>
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
        <div className="justify-self-end flex flex-row items-center gap-2">
          {transitionMode === 'day' ? 'Wakeup' : 'Bedtime'} sound
          <div
            className={clsx(
              'h-8 w-8',
              transitionMode === 'day'
                ? 'i-fluent-emoji-sun-with-face'
                : 'i-fluent-emoji-full-moon-face',
            )}
          />
        </div>
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
