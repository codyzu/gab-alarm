import {createLazyFileRoute} from '@tanstack/react-router';
import clsx from 'clsx';
import {FormProvider, useForm} from 'react-hook-form';
import {type Day, type Settings, days} from 'shared';
import {useEffect, useState} from 'react';
import DayControl from '../DayControl.tsx';
import {getSettings, putSettings} from '../schedule.ts';
import {defaultSettings} from '../default-settings.ts';
import OverrideControl from '../OverrideControl.tsx';

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

  return (
    <div className="px-4 py-8 bg-primary min-h-100dvh flex flex-row items-stretch">
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-8"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 items-center">
            <button
              type="button"
              className={clsx(day === 'tomorrow' ? 'btn-primary' : 'btn')}
              onClick={() => {
                setDay('tomorrow');
              }}
            >
              tomorrow
            </button>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
              {days.map((dayName) => (
                <button
                  key={dayName}
                  type="button"
                  className={clsx(day === dayName ? 'btn-primary' : 'btn')}
                  onClick={() => {
                    setDay(dayName);
                  }}
                >
                  {dayName}
                </button>
              ))}
            </div>
          </div>
          {day === 'tomorrow' ? (
            <OverrideControl />
          ) : (
            <DayControl key={day} dayName={day} />
          )}
          <div className="flex flex-row gap-4 items-end flex-grow-1 justify-between">
            <button
              className="btn-secondary"
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
                'btn-primary',
                methods.formState.isDirty &&
                  'outline-red outline-4 outline-solid',
              )}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
