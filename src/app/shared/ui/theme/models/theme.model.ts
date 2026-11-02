export interface ThemeState {
  mode: ThemeMode;
  primary: PrimaryColor;
  surface: SurfaceColor;
  trigger: boolean;
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export type PrimaryColor =
  | 'blue'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'lime'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'fuchsia';

export type SurfaceColor =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'soho'
  | 'viva'
  | 'ocean';
