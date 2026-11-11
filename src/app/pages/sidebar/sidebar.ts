import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout-container">

      <!-- BOTÓN MENÚ MÓVIL (HAMBURGUESA) -->
      <button class="mobile-toggle-btn" (click)="toggleSidebar()" aria-label="Abrir menú">
        ☰
      </button>

      <!-- OVERLAY PARA MÓVIL CUANDO EL SIDEBAR ESTÁ ABIERTO -->
      <div class="sidebar-overlay" [class.active]="isSidebarOpen" (click)="toggleSidebar()"></div>

      <!-- SIDEBAR LATERAL -->
      <aside class="sidebar" [class.open]="isSidebarOpen">
        <div class="sidebar-header">
          <div>
            <h2>Panel Admin</h2>
            <p>Sistema de Ventas</p>
          </div>
          <!-- Botón de cerrar dentro del sidebar en móvil -->
          <button class="close-sidebar-btn" (click)="toggleSidebar()">×</button>
        </div>

        <nav class="sidebar-menu" (click)="closeOnMobile()">
          <a routerLink="/productos" routerLinkActive="active" class="menu-item">
            📦 <span>Productos</span>
          </a>
          <a routerLink="/pedidos" routerLinkActive="active" class="menu-item">
            🛒 <span>Pedidos</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button (click)="logout()" class="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- CONTENIDO PRINCIPAL DINÁMICO -->
      <main class="main-content-area">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .app-layout-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      position: relative;
    }

    /* Botón hamburguesa (oculto en desktop) */
    .mobile-toggle-btn {
      display: none;
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 100;
      background: #0f172a;
      color: white;
      border: none;
      font-size: 1.5rem;
      padding: 0.4rem 0.7rem;
      border-radius: 0.375rem;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    /* Botón cerrar dentro del sidebar (solo móvil) */
    .close-sidebar-btn {
      display: none;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.5rem;
      cursor: pointer;
    }

    /* Overlay para oscurecer el fondo en móviles */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .sidebar {
      width: 260px;
      background: #0f172a;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 4px 0 10px rgba(0,0,0,0.05);
      transition: transform 0.3s ease-in-out;
      z-index: 1001;
    }

    .sidebar-header {
      padding: 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sidebar-header h2 { margin: 0; font-size: 1.25rem; color: #f8fafc; }
    .sidebar-header p { margin: 0.25rem 0 0; font-size: 0.75rem; color: #94a3b8; }

    .sidebar-menu {
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .menu-item:hover, .menu-item.active {
      background: #1e293b;
      color: #ffffff;
      border-left: 4px solid #6366f1;
    }

    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid #334155;
      background: #0f172a;
    }

    .btn-logout {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 0.6rem;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-logout:hover {
      background: #ef4444;
      color: white;
    }

    .main-content-area {
      flex: 1;
      background: #f8fafc;
      overflow-y: auto;
    }

    /* RESPONSIVE DESIGN (Pantallas menores a 768px) */
    @media (max-width: 768px) {
      .mobile-toggle-btn { display: block; }
      .close-sidebar-btn { display: block; }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%); /* Oculto fuera de pantalla por defecto */
      }
      .sidebar.open { transform: translateX(0); /* Se muestra al abrir */ }

      .sidebar-overlay.active {
        display: block;
        opacity: 1;
        pointer-events: auto;
      }

      .main-content-area {
        padding-top: 4rem; /* Espacio para que el botón hamburguesa no tape el contenido */
      }
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeOnMobile(): void {
    // En móvil, al elegir una opción del menú se cierra el sidebar automáticamente
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
