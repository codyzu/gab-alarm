import clsx from 'clsx';
import DayControl from './DayControl';
import {days} from './schedule.types';
import TransitionControl from './TransitionControl';
import {useRawSchedule} from './schedule';

export default function Admin() {
  const {
    settings,
    saveSettings,
    setScheduleSound,
    setScheduleTransition,
    setOverrideTime,
    setOverrideSound,
    resetToDefaults,
    override,
    resetOverride,
  } = useRawSchedule();

  return (
    <div className="p4">
      <form
        className="grid grid-cols-[1fr_auto] gap-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void saveSettings();
        }}
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
            time={settings.override.transition}
            sound={settings.override.transition.sound}
            setTime={(time) => {
              setOverrideTime(time);
            }}
            setSound={(sound) => {
              setOverrideSound(sound);
            }}
          />
          <button
            className="col-start-2 px-2 py-4 border-2 border-white rounded-lg"
            type="button"
            onClick={resetOverride}
          >
            Clear
          </button>
        </div>
        {...days.map((dayName) => (
          <DayControl
            key={dayName}
            dayName={dayName}
            night={settings.schedule[dayName].night}
            day={settings.schedule[dayName].day}
            setNightTime={(time) => {
              setScheduleTransition(time, dayName, 'night');
            }}
            setNightSound={(sound) => {
              setScheduleSound(sound, dayName, 'night');
            }}
            setDayTime={(time) => {
              setScheduleTransition(time, dayName, 'day');
            }}
            setDaySound={(sound) => {
              setScheduleSound(sound, dayName, 'day');
            }}
          />
        ))}
        <button
          className="px-2 py-2 bg-gray-400 active:bg-gray-800 rounded justify-self-start"
          type="button"
          onClick={() => {
            resetToDefaults();
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
