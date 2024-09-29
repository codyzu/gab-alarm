import { z } from 'zod';
declare const timeSchema: z.ZodObject<{
    hours: z.ZodNumber;
    minutes: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    hours: number;
    minutes: number;
}, {
    hours: number;
    minutes: number;
}>;
export type Time = z.infer<typeof timeSchema>;
declare const transitionSchema: z.ZodObject<{
    hours: z.ZodNumber;
    minutes: z.ZodNumber;
    sound: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    hours: number;
    minutes: number;
    sound: boolean;
}, {
    hours: number;
    minutes: number;
    sound: boolean;
}>;
export type Transition = z.infer<typeof transitionSchema>;
declare const overrideSchema: z.ZodObject<{
    transition: z.ZodObject<{
        hours: z.ZodNumber;
        minutes: z.ZodNumber;
        sound: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        hours: number;
        minutes: number;
        sound: boolean;
    }, {
        hours: number;
        minutes: number;
        sound: boolean;
    }>;
    setAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    transition: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
    setAt: string;
}, {
    transition: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
    setAt: string;
}>;
export type Override = z.infer<typeof overrideSchema>;
declare const daySchema: z.ZodObject<{
    day: z.ZodObject<{
        hours: z.ZodNumber;
        minutes: z.ZodNumber;
        sound: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        hours: number;
        minutes: number;
        sound: boolean;
    }, {
        hours: number;
        minutes: number;
        sound: boolean;
    }>;
    night: z.ZodObject<{
        hours: z.ZodNumber;
        minutes: z.ZodNumber;
        sound: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        hours: number;
        minutes: number;
        sound: boolean;
    }, {
        hours: number;
        minutes: number;
        sound: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    day: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
    night: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
}, {
    day: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
    night: {
        hours: number;
        minutes: number;
        sound: boolean;
    };
}>;
export type DaySchedule = z.infer<typeof daySchema>;
export type When = keyof DaySchedule;
declare const weekSchema: z.ZodObject<{
    monday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    tuesday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    wednesday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    thursday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    friday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    saturday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
    sunday: z.ZodObject<{
        day: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        night: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }, {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    monday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    tuesday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    wednesday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    thursday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    friday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    saturday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    sunday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
}, {
    monday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    tuesday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    wednesday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    thursday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    friday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    saturday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
    sunday: {
        day: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        night: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
    };
}>;
export type WeekSchedule = z.infer<typeof weekSchema>;
export declare const settingsSchema: z.ZodObject<{
    schedule: z.ZodObject<{
        monday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        tuesday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        wednesday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        thursday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        friday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        saturday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
        sunday: z.ZodObject<{
            day: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
            night: z.ZodObject<{
                hours: z.ZodNumber;
                minutes: z.ZodNumber;
                sound: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hours: number;
                minutes: number;
                sound: boolean;
            }, {
                hours: number;
                minutes: number;
                sound: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }, {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        monday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        tuesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        wednesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        thursday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        friday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        saturday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        sunday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
    }, {
        monday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        tuesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        wednesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        thursday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        friday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        saturday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        sunday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
    }>;
    override: z.ZodObject<{
        transition: z.ZodObject<{
            hours: z.ZodNumber;
            minutes: z.ZodNumber;
            sound: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hours: number;
            minutes: number;
            sound: boolean;
        }, {
            hours: number;
            minutes: number;
            sound: boolean;
        }>;
        setAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        transition: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        setAt: string;
    }, {
        transition: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        setAt: string;
    }>;
}, "strip", z.ZodTypeAny, {
    schedule: {
        monday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        tuesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        wednesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        thursday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        friday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        saturday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        sunday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
    };
    override: {
        transition: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        setAt: string;
    };
}, {
    schedule: {
        monday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        tuesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        wednesday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        thursday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        friday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        saturday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
        sunday: {
            day: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
            night: {
                hours: number;
                minutes: number;
                sound: boolean;
            };
        };
    };
    override: {
        transition: {
            hours: number;
            minutes: number;
            sound: boolean;
        };
        setAt: string;
    };
}>;
export type Settings = z.infer<typeof settingsSchema>;
export type Day = keyof WeekSchedule;
export declare const days: Day[];
export declare function timeToMinutes(time: Time): number;
export declare function dateToMinutes(date: Date): number;
export type ClockMode = 'day' | 'night';
export {};
