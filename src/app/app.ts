import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Background } from '@shared/ui/background/background';

@Component({
  selector: 'app-root',
  imports: [ToastModule, Background],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
