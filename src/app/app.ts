import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { HeaderComponent } from './components/header-component/header-component';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [
    FormsModule,
    ZXingScannerModule,
    LucideAngularModule,
    CommonModule,
    NavbarComponent,
    RouterOutlet,
    HeaderComponent,
  ],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
