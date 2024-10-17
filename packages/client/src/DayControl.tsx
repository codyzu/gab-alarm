import TransitionControl from './TransitionControl';

export default function DayControl({dayName}: {readonly dayName: string}) {
  return (
    <div className="flex flex-col rounded-xl p-4 border-4 gap-8">
      <TransitionControl
        transitionMode="day"
        settingsKey={`schedule.${dayName}.day`}
      />
      <TransitionControl
        transitionMode="night"
        settingsKey={`schedule.${dayName}.night`}
      />
    </div>
  );
}
