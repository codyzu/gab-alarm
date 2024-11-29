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
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center flex-grow">
        <div
          className={clsx(
            'h-16 w-16',
            transitionMode === 'day'
              ? 'i-fluent-emoji-sun-with-face'
              : 'i-fluent-emoji-full-moon-face',
          )}
        />
        <div className="font-bold">
          {transitionMode === 'day' ? 'Wake' : 'Sleep'}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <label className="flex flex-row justify-end gap-4 items-center">
          <div>time</div>
          <input
            className="text-black rounded text-center focus:outline-green justify-self-start p4 font-mono"
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
        <button
          type="button"
          className="btn flex flex-row items-center justify-center gap-2"
          onClick={() => {
            soundField.onChange(!soundField.value);
            onChange?.();
          }}
        >
          <div
            className={clsx(
              'h-8 w-8',
              soundField.value
                ? 'i-tabler-volume text-active'
                : 'i-tabler-volume-3 text-alert',
            )}
          />
          <div>{soundField.value ? 'sound on' : 'sound off'}</div>
        </button>
      </div>
    </div>
  );
}
