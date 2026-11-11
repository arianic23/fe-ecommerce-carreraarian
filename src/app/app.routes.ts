import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ProductosComponent } from './pages/productos/productos';
import { PedidosComponent } from './pages/pedidos/pedidos';
import { LayoutComponent } from './pages/sidebar/sidebar';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent, // Aquí se llama el sidebar
    canActivate: [authGuard],   // Protegido: solo entra si está logueado
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
