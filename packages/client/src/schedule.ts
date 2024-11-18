import {settingsSchema, type Settings} from 'shared';
import {defaultSettings} from 'shared/default-settings';

export async function getSettings(): Promise<Settings> {
  const response = await fetch('/settings');
  const data: unknown = await response.json();

  try {
    return settingsSchema.parse(data);
  } catch (error) {
    console.error(error);
    console.error('Loading default settings');
    return defaultSettings;
  }
}

export async function putSettings(settings: Settings) {
  const result = await fetch('/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!result.ok) {
    console.error(result);
    throw new Error('Unable to save settings.');
  }
}
