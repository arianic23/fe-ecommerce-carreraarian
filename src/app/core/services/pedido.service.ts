import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/pedidos`;

  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API_URL);
  }

  obtenerPedidoPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API_URL}/${id}`);
  }

  crearPedido(pedido: { cliente: string; items: { productoId: number; cantidad: number }[] }): Observable<Pedido> {
    return this.http.post<Pedido>(this.API_URL, pedido);
  }
}
