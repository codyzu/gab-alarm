import {useCallback, useEffect, useState} from 'react';
import DayControl from './DayControl';
import {type Time, type Day, type WeekSchedule} from './schedule.types';

const defaultSchedule: WeekSchedule = {
  monday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  tuesday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  wednesday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  thursday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  friday: {
    day: {hours: 7, minutes: 0},
    night: {hours: 20, minutes: 30},
  },
  saturday: {
    day: {hours: 8, minutes: 0},
    night: {hours: 21, minutes: 0},
  },
  sunday: {
    day: {hours: 8, minutes: 0},
    night: {hours: 21, minutes: 0},
  },
};

export default function Admin() {
  const [schedule, setSchedule] = useState(defaultSchedule);

  useEffect(() => {
    let cancel = false;
    async function fetchSchedule() {
      const response = await fetch('/schedule');
      const nextSchedule = (await response.json()) as WeekSchedule;

      if (cancel) {
        return;
      }

      setSchedule(nextSchedule);
    }

    void fetchSchedule();

    return () => {
      cancel = true;
    };
  }, []);

  const updateNightSchedule = useCallback(
    (night: Time, dayName: Day) => {
      setSchedule((currentSchedule) => ({
        ...currentSchedule,
        [dayName]: {
          ...currentSchedule.monday,
          night,
        },
      }));
    },
    [setSchedule],
  );
  const updateDaySchedule = useCallback(
    (day: Time, dayName: Day) => {
      setSchedule((currentSchedule) => ({
        ...currentSchedule,
        [dayName]: {
          ...currentSchedule.monday,
          day,
        },
      }));
    },
    [setSchedule],
  );

  return (
    <div className="p4">
      <form
        className="grid grid-cols-3 gap-y-4"
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
        <DayControl
          dayName="Monday"
          night={schedule.monday.night}
          day={schedule.monday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'monday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'monday');
          }}
        />
        <DayControl
          dayName="Tuesday"
          night={schedule.tuesday.night}
          day={schedule.tuesday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'tuesday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'tuesday');
          }}
        />
        <DayControl
          dayName="Wednesday"
          night={schedule.wednesday.night}
          day={schedule.wednesday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'wednesday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'wednesday');
          }}
        />
        <DayControl
          dayName="Thursday"
          night={schedule.thursday.night}
          day={schedule.thursday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'thursday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'thursday');
          }}
        />
        <DayControl
          dayName="Friday"
          night={schedule.friday.night}
          day={schedule.friday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'friday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'friday');
          }}
        />
        <DayControl
          dayName="Saturday"
          night={schedule.saturday.night}
          day={schedule.saturday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'saturday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'saturday');
          }}
        />
        <DayControl
          dayName="Sunday"
          night={schedule.sunday.night}
          day={schedule.sunday.day}
          setNight={(nextNight) => {
            updateNightSchedule(nextNight, 'sunday');
          }}
          setDay={(nextDay) => {
            updateDaySchedule(nextDay, 'sunday');
          }}
        />
        <button
          className="col-start-3 px-2 py-4 bg-green active:bg-green-800 rounded"
          type="submit"
        >
          Save
        </button>
        {/* <DayControl day="Tuesday" /> */}
      </form>
    </div>
  );
}
