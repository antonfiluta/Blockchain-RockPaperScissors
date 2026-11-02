import { computed, DOCUMENT, inject } from '@angular/core';
import {
  PrimaryColor,
  SurfaceColor,
  ThemeMode,
  ThemeState,
} from '@shared/ui/theme/models/theme.model';
import {
  SURFACE_PALETTES,
  THEME_STORAGE_KEY,
} from '@shared/ui/theme/utils/theme.constants';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { updatePreset, updateSurfacePalette } from '@primeuix/themes';
import { isThemeState } from '@shared/ui/theme/utils/type.guards';
import { createPalette } from '@shared/ui/theme/utils/palette.builder';

export const initialThemeState: ThemeState = {
  mode: ThemeMode.System,
  primary: 'emerald',
  surface: 'gray',
  trigger: false,
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },

  withState(initialThemeState),
  withComputed((store) => ({
    isDark: computed(() => {
      store.trigger();

      const mode = store.mode();
      if (mode === 'dark') return true;
      if (mode === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }),
  })),
  withMethods((store, document = inject(DOCUMENT)) => ({
    setMode(mode: ThemeMode) {
      this._updateAndApply({ mode });
    },
    setPrimary(primary: PrimaryColor) {
      this._updateAndApply({ primary });
    },
    setSurface(surface: SurfaceColor) {
      this._updateAndApply({ surface });
    },

    _updateAndApply(partial: Partial<ThemeState>) {
      patchState(store, partial);
      this._persist();

      if ('mode' in partial) this._applyMode();
      if ('primary' in partial) this._applyPrimary();
      if ('surface' in partial) this._applySurface();
    },

    _restore() {
      const rawThemeState = localStorage.getItem(THEME_STORAGE_KEY);

      if (rawThemeState) {
        try {
          const saved: unknown = JSON.parse(rawThemeState);
          if (isThemeState(saved)) {
            patchState(store, saved);
          } else {
            throw new Error('Incorrect Theme Settings Data');
          }
        } catch (error) {
          localStorage.removeItem(THEME_STORAGE_KEY);
          console.error(error);
        }
      }

      this._applyMode();
      this._applySurface();
      this._applyPrimary();
    },

    _persist() {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(getState(store)));
    },

    _applyMode() {
      patchState(store, { trigger: !store.trigger() });

      const darkMode = store.isDark();
      document.documentElement.classList.toggle('dark', darkMode);
    },

    _applySurface() {
      const surface = store.surface();
      const palette = SURFACE_PALETTES[surface];
      updateSurfacePalette(palette);
    },

    _applyPrimary() {
      const primary = store.primary();

      updatePreset({
        semantic: {
          primary: createPalette(primary),
          colorScheme: {
            light: {
              primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}',
              },
            },
            dark: {
              primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}',
              },
              highlight: {
                background:
                  'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground:
                  'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)',
              },
            },
          },
        },
      });
    },

    _initialize() {
      this._restore();

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          if (store.mode() === 'system') this._applyMode();
        });
    },
  })),
  withHooks({
    onInit(store) {
      setTimeout(() => store._initialize());
    },
  }),
);
