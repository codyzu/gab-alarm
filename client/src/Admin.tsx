import {useCallback, useEffect, useState} from 'react';
import DayControl from './DayControl';
import {type Time, type Day, settingsSchema} from './schedule.types';
import TransitionControl from './TransitionControl';
import {defaultSchedule} from './default-settings';

export default function Admin() {
  const [schedule, setSchedule] = useState(defaultSchedule);

  useEffect(() => {
    let cancel = false;
    async function fetchSchedule() {
      const response = await fetch('/schedule');
      const data: unknown = await response.json();

      if (cancel) {
        return;
      }

      // Throws if the data is invalid, resulting in the default schedule in the state
      const nextSchedule = settingsSchema.parse(data);
      setSchedule(nextSchedule);
    }

    void fetchSchedule();

    return () => {
      cancel = true;
    };
  }, []);

  const updateNightTime = useCallback(
    (night: Time, dayName: Day) => {
      setSchedule((currentSchedule) => {
        return {
          ...currentSchedule,
          [dayName]: {
            ...currentSchedule[dayName],
            night: {
              ...currentSchedule[dayName].night,
              ...night,
            },
          },
        };
      });
    },
    [setSchedule],
  );

  const updateNightSound = useCallback(
    (sound: boolean, dayName: Day) => {
      setSchedule((currentSchedule) => {
        return {
          ...currentSchedule,
          [dayName]: {
            ...currentSchedule[dayName],
            night: {
              ...currentSchedule[dayName].night,
              sound,
            },
          },
        };
      });
    },
    [setSchedule],
  );

  const updateDayTime = useCallback(
    (day: Time, dayName: Day) => {
      setSchedule((currentSchedule) => {
        return {
          ...currentSchedule,
          [dayName]: {
            ...currentSchedule[dayName],
            day: {
              ...currentSchedule[dayName].day,
              ...day,
            },
          },
        };
      });
    },
    [setSchedule],
  );

  const updateDaySound = useCallback(
    (sound: boolean, dayName: Day) => {
      setSchedule((currentSchedule) => {
        return {
          ...currentSchedule,
          [dayName]: {
            ...currentSchedule[dayName],
            day: {
              ...currentSchedule[dayName].day,
              sound,
            },
          },
        };
      });
    },
    [setSchedule],
  );

  return (
    <div className="p4">
      <form
        className="grid grid-cols-[1fr_auto] gap-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          void fetch('/schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(schedule),
          });
        }}
      >
        <div>Tomorrow Morning</div>
        <TransitionControl
          label="Tomorrow"
          time={schedule.override.transition}
          sound={schedule.override.transition.sound}
          setTime={(time) => {
            setSchedule((currentSchedule) => {
              return {
                ...currentSchedule,
                override: {
                  ...currentSchedule.override,
                  transition: {
                    ...currentSchedule.override.transition,
                    ...time,
                  },
                },
              };
            });
          }}
          setSound={(sound) => {
            setSchedule((currentSchedule) => {
              return {
                ...currentSchedule,
                override: {
                  ...currentSchedule.override,
                  transition: {
                    ...currentSchedule.override.transition,
                    sound,
                  },
                },
              };
            });
          }}
        />
        <DayControl
          dayName="Monday"
          night={schedule.monday.night}
          day={schedule.monday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'monday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'monday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'monday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'monday');
          }}
        />
        <DayControl
          dayName="Tuesday"
          night={schedule.tuesday.night}
          day={schedule.tuesday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'tuesday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'tuesday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'tuesday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'tuesday');
          }}
        />
        <DayControl
          dayName="Wednesday"
          night={schedule.wednesday.night}
          day={schedule.wednesday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'wednesday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'wednesday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'wednesday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'wednesday');
          }}
        />
        <DayControl
          dayName="Thursday"
          night={schedule.thursday.night}
          day={schedule.thursday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'thursday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'thursday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'thursday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'thursday');
          }}
        />
        <DayControl
          dayName="Friday"
          night={schedule.friday.night}
          day={schedule.friday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'friday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'friday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'friday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'friday');
          }}
        />
        <DayControl
          dayName="Saturday"
          night={schedule.saturday.night}
          day={schedule.saturday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'saturday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'saturday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'saturday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'saturday');
          }}
        />
        <DayControl
          dayName="Sunday"
          night={schedule.sunday.night}
          day={schedule.sunday.day}
          setNightTime={(nextNight) => {
            updateNightTime(nextNight, 'sunday');
          }}
          setDayTime={(nextDay) => {
            updateDayTime(nextDay, 'sunday');
          }}
          setNightSound={(playSound) => {
            updateNightSound(playSound, 'sunday');
          }}
          setDaySound={(playSound) => {
            updateDaySound(playSound, 'sunday');
          }}
        />
        <button
          className="px-2 py-2 bg-gray-400 active:bg-gray-800 rounded justify-self-start"
          type="button"
          onClick={() => {
            setSchedule(defaultSchedule);
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
    </div>
  );
}
