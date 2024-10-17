import clsx from 'clsx';
import {useFormContext, useWatch} from 'react-hook-form';
import {type Settings} from 'shared';
import TransitionControl from './TransitionControl';
import {isOverrideEnabled} from './schedule';
import {defaultSettings} from './default-settings';

export default function OverrideControl() {
  const {setValue} = useFormContext();
  const formSettings = useWatch() as Settings;
  const override = isOverrideEnabled(formSettings, new Date());

  return (
    <div
      className={clsx(
        'flex flex-col rounded-xl p-4 border-4 gap-4',
        override && 'border-green-500',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div>{override ? 'override enabled' : 'override disabled'}</div>
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
