import { z } from 'zod';
const timeSchema = z.object({ hours: z.number(), minutes: z.number() });
const transitionSchema = timeSchema.extend({ sound: z.boolean() });
const overrideSchema = z.object({
    transition: transitionSchema,
    setAt: z.string().datetime(),
});
const daySchema = z.object({
    day: transitionSchema,
    night: transitionSchema,
    // DayOverride: overrideSchema,
});
const weekSchema = z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
});
export const settingsSchema = z.object({
    schedule: weekSchema,
    override: overrideSchema,
});
export const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];
export function timeToMinutes(time) {
    return time.hours * 60 + time.minutes;
}
export function dateToMinutes(date) {
    return date.getHours() * 60 + date.getMinutes();
}
