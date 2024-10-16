import {createLazyFileRoute} from '@tanstack/react-router';
import clsx from 'clsx';
import {FormProvider, useForm} from 'react-hook-form';
import {type Day, type Settings} from 'shared';
import {useEffect, useState} from 'react';
import {days} from '../../../shared/schedule.types.ts';
import DayControl from '../DayControl.tsx';
import TransitionControl from '../TransitionControl.tsx';
import {getSettings, isOverrideEnabled, putSettings} from '../schedule.ts';
import {defaultSettings} from '../default-settings.ts';

export const Route = createLazyFileRoute('/admin')({
  component: Admin,
});

function Admin() {
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

  const [day, setDay] = useState<Day | 'tomorrow'>('tomorrow');

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
          <div className="col-span-2 flex flex-row flex-wrap gap-2 justify-center">
            <button
              type="button"
              className={clsx('btn', day === 'tomorrow' && 'bg-green')}
              onClick={() => {
                setDay('tomorrow');
              }}
            >
              tomorrow
            </button>
            {days.map((dayName) => (
              <button
                key={dayName}
                type="button"
                className={clsx('btn', day === dayName && 'bg-green')}
                onClick={() => {
                  setDay(dayName);
                }}
              >
                {dayName}
              </button>
            ))}
          </div>
          <div className="col-span-2">
            {day === 'tomorrow' ? (
              <div className={clsx(override && 'bg-green-800')}>
                <div className="col-span-2 text-2xl font-bold">tomorrow</div>

                <TransitionControl
                  transitionMode="day"
                  settingsKey="override.transition"
                  onChange={() => {
                    // Update setAt anytime something is changed in the override
                    methods.setValue(
                      'override.setAt',
                      new Date().toISOString(),
                      {
                        shouldDirty: true,
                      },
                    );
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
            ) : (
              <DayControl key={day} dayName={day} />
            )}
          </div>
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
