export type Time = {hours: number; minutes: number};
export type Transition = {sound: boolean} & Time;
export type DaySchedule = {day: Transition; night: Transition};
export type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};
export type Override = {transition: Transition; expired: boolean};
export type Settings = {override: Override} & WeekSchedule;
export type Day = keyof WeekSchedule;
