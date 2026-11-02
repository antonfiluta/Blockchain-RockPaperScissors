import { ThemeMode, ThemeState } from '../models/theme.model';
import { PRIMARY_COLORS, SURFACE_COLORS } from './theme.constants';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function isThemeState(value: unknown): value is ThemeState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  return (
    isThemeMode(obj['mode']) &&
    typeof obj['primary'] === 'string' &&
    (PRIMARY_COLORS as readonly string[]).includes(obj['primary']) &&
    typeof obj['surface'] === 'string' &&
    (SURFACE_COLORS as readonly string[]).includes(obj['surface'])
  );
}
