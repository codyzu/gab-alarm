import {type Settings} from './schedule.types';

export const defaultSchedule: Settings = {
  override: {transition: {hours: 7, minutes: 0, sound: false}, expired: true},
  monday: {
    day: {hours: 7, minutes: 0, sound: true},
    night: {hours: 20, minutes: 30, sound: true},
  },
  tuesday: {
    day: {hours: 7, minutes: 0, sound: true},
    night: {hours: 20, minutes: 30, sound: true},
  },
  wednesday: {
    day: {hours: 7, minutes: 0, sound: true},
    night: {hours: 20, minutes: 30, sound: true},
  },
  thursday: {
    day: {hours: 7, minutes: 0, sound: true},
    night: {hours: 20, minutes: 30, sound: true},
  },
  friday: {
    day: {hours: 7, minutes: 0, sound: true},
    night: {hours: 20, minutes: 30, sound: true},
  },
  saturday: {
    day: {hours: 8, minutes: 0, sound: false},
    night: {hours: 21, minutes: 0, sound: true},
  },
  sunday: {
    day: {hours: 8, minutes: 0, sound: false},
    night: {hours: 21, minutes: 0, sound: true},
  },
};
