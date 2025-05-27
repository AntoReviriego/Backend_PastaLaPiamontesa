import { Settings } from 'luxon';

export function configureTimezone() {
  Settings.defaultZone = 'America/Argentina/Buenos_Aires';
}
