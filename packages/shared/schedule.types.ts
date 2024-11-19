import {z} from 'zod';

const timeSchema = z.object({hours: z.number(), minutes: z.number()});
export type Time = z.infer<typeof timeSchema>;

const transitionSchema = z.object({time: timeSchema, sound: z.boolean()});
export type Transition = z.infer<typeof transitionSchema>;

const overrideSchema = z.object({
  transition: transitionSchema,
  setAt: z.string().datetime(),
});
export type Override = z.infer<typeof overrideSchema>;

const daySchema = z.object({
  day: transitionSchema,
  night: transitionSchema,
  // DayOverride: overrideSchema,
});
export type DaySchedule = z.infer<typeof daySchema>;
export type When = keyof DaySchedule;

const weekSchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
});
export type WeekSchedule = z.infer<typeof weekSchema>;

export const settingsSchema = z.object({
  schedule: weekSchema,
  override: overrideSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export type Day = keyof WeekSchedule;

export const days: Day[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function timeToMinutes(time: Time): number {
  return time.hours * 60 + time.minutes;
}

export function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export const clockModeSchema = z.enum(['day', 'night']);
export type ClockMode = z.infer<typeof clockModeSchema>;

export const clockStateSchema = z.object({
  nextTransition: z.string().datetime({offset: true}),
  previousTransition: z.string().datetime({offset: true}),
  nextMode: clockModeSchema,
  currentMode: clockModeSchema,
  isOverrideActive: z.boolean(),
  isSoundActive: z.boolean(),
});
export type ClockState = z.infer<typeof clockStateSchema>;
