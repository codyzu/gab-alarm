import {type Settings} from '../../shared/schedule.types';

export const defaultSettings: Settings = {
  override: {
    transition: {time: {hours: 8, minutes: 0}, sound: true},
    setAt: new Date(2000, 0).toISOString(),
  },
  schedule: {
    monday: {
      day: {time: {hours: 7, minutes: 20}, sound: true},
      night: {time: {hours: 20, minutes: 30}, sound: true},
    },
    tuesday: {
      day: {time: {hours: 7, minutes: 20}, sound: true},
      night: {time: {hours: 20, minutes: 30}, sound: true},
    },
    wednesday: {
      day: {time: {hours: 7, minutes: 50}, sound: true},
      night: {time: {hours: 20, minutes: 30}, sound: true},
    },
    thursday: {
      day: {time: {hours: 7, minutes: 20}, sound: true},
      night: {time: {hours: 20, minutes: 30}, sound: true},
    },
    friday: {
      day: {time: {hours: 7, minutes: 20}, sound: true},
      night: {time: {hours: 21, minutes: 0}, sound: true},
    },
    saturday: {
      day: {time: {hours: 8, minutes: 30}, sound: false},
      night: {time: {hours: 21, minutes: 0}, sound: true},
    },
    sunday: {
      day: {time: {hours: 8, minutes: 30}, sound: false},
      night: {time: {hours: 20, minutes: 30}, sound: true},
    },
  },
};
