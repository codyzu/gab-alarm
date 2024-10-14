import clsx from 'clsx';
// Import {useForm} from 'react-hook-form';
import {FormProvider, useForm} from 'react-hook-form';
import {type Settings} from 'shared';
import {days} from '../../shared/schedule.types.ts';
import DayControl from './DayControl';
import TransitionControl from './TransitionControl';
import {useRawSchedule} from './schedule';
import {defaultSettings} from './default-settings.ts';

export default function Admin() {
  const {serverSettings, putSettings, isOverrideEnabled} = useRawSchedule();

  const methods = useForm({
    defaultValues: defaultSettings,
    values: serverSettings,
  });

  const onSubmit = async (data: Settings) => putSettings(data);

  // Must be a better way to calculate this
  // Note that this will only change if the settings change or the current minute 🤔
  const formSettings = methods.watch();
  const override = isOverrideEnabled(formSettings, new Date());
  console.log(formSettings);

  return (
    <div className="p4">
      <FormProvider {...methods}>
        <form
          className="grid grid-cols-[1fr_auto] gap-y-4"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div
            className={clsx(
              'grid col-span-2 grid-cols-subgrid gap-y-1 text-white rounded-lg p2',
              override ? 'bg-green-800' : 'bg-gray-800',
            )}
          >
            <div className="col-span-2 text-2xl font-bold">Tomorrow</div>
            <TransitionControl
              label="Wakeup"
              settingsKey="override.transition"
              onChange={() => {
                methods.setValue('override.setAt', new Date().toISOString());
              }}
            />
            <input
              type="button"
              className="col-start-2 px-2 py-4 border-2 border-white rounded-lg"
              value="Clear"
              onClick={() => {
                methods.resetField('override');
              }}
            />
          </div>
          {...days.map((dayName) => (
            <DayControl key={dayName} dayName={dayName} />
          ))}
          <button
            className="px-2 py-2 bg-gray-400 active:bg-gray-800 rounded justify-self-start"
            type="button"
            onClick={() => {
              methods.reset();
            }}
          >
            Defaults
          </button>
          <button
            className="px-2 py-4 bg-green active:bg-green-800 rounded"
            type="submit"
          >
            Save
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
