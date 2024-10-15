import clsx from 'clsx';
import {FormProvider, useForm} from 'react-hook-form';
import {type Settings} from 'shared';
import {useEffect, useState} from 'react';
import {days} from '../../shared/schedule.types.ts';
import DayControl from './DayControl';
import TransitionControl from './TransitionControl';
import {getSettings, isOverrideEnabled, putSettings} from './schedule';
import {defaultSettings} from './default-settings.ts';

export default function Admin() {
  const methods = useForm({
    defaultValues: getSettings,
  });

  const [submittedData, setSubmittedData] = useState<Settings>();
  const onSubmit = async (data: Settings) => {
    await putSettings(data);
    setSubmittedData(data);
  };

  // Must be a better way to calculate this
  const formSettings = methods.watch();

  // Respect order when resetting on submit as per the docs: https://react-hook-form.com/docs/useform/reset
  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      methods.reset({...submittedData});
    }
  }, [
    methods,
    methods.formState.isSubmitSuccessful,
    submittedData,
    methods.reset,
  ]);

  if (methods.formState.isLoading) {
    return null;
  }

  const override = isOverrideEnabled(formSettings, new Date());

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
                // Update setAt anytime something is changed in the override
                methods.setValue('override.setAt', new Date().toISOString(), {
                  shouldDirty: true,
                });
              }}
            />
            <input
              type="button"
              className="col-start-2 px-2 py-4 border-2 border-white rounded-lg"
              value="Clear"
              onClick={() => {
                methods.setValue('override', defaultSettings.override, {
                  shouldDirty: true,
                });
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
              // Don't update the default values
              methods.reset(defaultSettings, {keepDefaultValues: true});
            }}
          >
            Defaults
          </button>
          <button
            className={clsx(
              'px-2 py-4 active:bg-green-800 rounded bg-green',
              methods.formState.isDirty &&
                'outline-red outline-4 outline-solid',
            )}
            type="submit"
          >
            Save
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
