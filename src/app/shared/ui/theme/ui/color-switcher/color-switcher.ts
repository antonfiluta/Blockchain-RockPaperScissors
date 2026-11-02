import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { ColorButton } from '@shared/ui/color-button/color-button';
import { ThemeStore } from '@shared/ui/theme.store';
import {
  PRIMARY_COLORS,
  SURFACE_COLORS,
  SURFACE_PALETTES,
} from '../../utils/theme.constants';
import { PrimaryColor, SurfaceColor } from '../../models/theme.model';

@Component({
  selector: 'app-color-switcher',
  imports: [CommonModule, ButtonModule, PopoverModule, ColorButton],
  templateUrl: './color-switcher.html',
  styleUrl: './color-switcher.css',
})
export class ColorSwitcher {
  public readonly store = inject(ThemeStore);

  public readonly primaryColors = PRIMARY_COLORS;
  public readonly surfaceColors = SURFACE_COLORS;
  public readonly surfacePalettes = SURFACE_PALETTES;

  public setPrimary(color: PrimaryColor) {
    this.store.setPrimary(color);
  }

  public setSurface(color: SurfaceColor) {
    this.store.setSurface(color);
  }
}
