import {z} from 'zod';

const timeSchema = z.object({hours: z.number(), minutes: z.number()});
export type Time = z.infer<typeof timeSchema>;

const transitionSchema = timeSchema.extend({sound: z.boolean()});
export type Transition = z.infer<typeof transitionSchema>;

const daySchema = z.object({day: transitionSchema, night: transitionSchema});
export type DaySchedule = z.infer<typeof daySchema>;

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

const overrideSchema = z.object({
  transition: transitionSchema,
  expired: z.boolean(),
});
export type Override = z.infer<typeof overrideSchema>;

export const settingsSchema = weekSchema.extend({override: overrideSchema});
export type Settings = z.infer<typeof settingsSchema>;

export type Day = keyof WeekSchedule;
