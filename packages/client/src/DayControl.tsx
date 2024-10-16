import TransitionControl from './TransitionControl';

export default function DayControl({dayName}: {readonly dayName: string}) {
  return (
    <div className="grid grid-cols-subgrid col-span-2">
      <div className="col-span-2 text-2xl font-bold">{dayName}</div>
      <div className="grid grid-cols-subgrid col-span-2 row-span-2 gap-y-1">
        <TransitionControl
          transitionMode="day"
          settingsKey={`schedule.${dayName}.day`}
        />
        <TransitionControl
          transitionMode="night"
          settingsKey={`schedule.${dayName}.night`}
        />
      </div>
    </div>
  );
}
