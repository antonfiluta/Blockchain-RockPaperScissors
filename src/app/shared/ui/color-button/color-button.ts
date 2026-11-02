import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-color-button',
  imports: [CommonModule],
  templateUrl: './color-button.html',
  styleUrl: './color-button.css',
})
export class ColorButton {
  title = input.required<string>();
  isPicked = input.required<boolean>();
  backgroundColor = input.required<string>();
  setColor = output<void>();
}
