export type Time = {hours: number; minutes: number};
export type DaySchedule = {day: Time; night: Time};
export type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  tomorrowMorning?: Time;
};
export type Day = keyof WeekSchedule;
