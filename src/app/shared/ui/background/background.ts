import { Component } from '@angular/core';
import { ThemeSwitcher } from '../theme/ui/theme-switcher/theme-switcher';
import { ColorSwitcher } from '../theme/ui/color-switcher/color-switcher';

@Component({
  selector: 'app-background',
  imports: [ThemeSwitcher, ColorSwitcher],
  templateUrl: './background.html',
  styleUrl: './background.css',
})
export class Background {}
