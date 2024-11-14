import clsx from 'clsx';
import {useFormContext, useWatch} from 'react-hook-form';
import {type Settings} from 'shared';
import {getClockState} from 'shared/clock-state';
import {DateTime} from 'luxon';
import TransitionControl from './TransitionControl';
import {defaultSettings} from './default-settings';

export default function OverrideControl() {
  const {setValue} = useFormContext();
  const formSettings = useWatch() as Settings;
  const {isOverrideActive} = getClockState(formSettings, DateTime.now());

  return (
    <div
      className={clsx(
        'flex flex-col rounded-xl p-4 border-4 gap-4',
        isOverrideActive && 'border-green-500',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div>{isOverrideActive ? 'override enabled' : 'override disabled'}</div>
      </div>

      <TransitionControl
        transitionMode="day"
        settingsKey="override.transition"
        onChange={() => {
          // Update setAt anytime something is changed in the override
          setValue('override.setAt', new Date().toISOString(), {
            shouldDirty: true,
          });
        }}
      />

      <input
        type="button"
        className="self-end align-middle btn"
        value="Clear"
        onClick={() => {
          setValue('override', defaultSettings.override, {
            shouldDirty: true,
          });
        }}
      />
    </div>
  );
}
