import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../core/services/pedido.service';
import { ProductoService } from '../../core/services/producto.service';
import { Pedido } from '../../models/pedido.model';
import { Producto } from '../../models/producto.model';
import { mensajeError } from '../../core/utils/error.util';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoService = inject(ProductoService);

  pedidos = signal<Pedido[]>([]);
  productosDisponibles = signal<Producto[]>([]);

  // Formulario nuevo pedido
  clienteNuevo = '';
  productoSeleccionadoId: number | null = null;
  cantidadSeleccionada: number = 1;
  itemsPedido: { productoId: number; nombre: string; cantidad: number; precio: number }[] = [];

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarProductos();
  }

  cargarPedidos(): void {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos.set(data),
      error: (err) => console.error('Error al cargar pedidos', err)
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productosDisponibles.set(data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  agregarItemAlPedido(): void {
    if (!this.productoSeleccionadoId || this.cantidadSeleccionada <= 0) return;

    const prod = this.productosDisponibles().find(p => p.id === Number(this.productoSeleccionadoId));
    if (!prod) return;

    this.itemsPedido.push({
      productoId: prod.id!,
      nombre: prod.nombre,
      cantidad: this.cantidadSeleccionada,
      precio: prod.precio
    });

    this.productoSeleccionadoId = null;
    this.cantidadSeleccionada = 1;
  }

  removerItem(index: number): void {
    this.itemsPedido.splice(index, 1);
  }

  guardarPedido(): void {
    if (!this.clienteNuevo.trim() || this.itemsPedido.length === 0) {
      alert('Ingrese el nombre del cliente y al menos un producto.');
      return;
    }

    const payload = {
      cliente: this.clienteNuevo,
      items: this.itemsPedido.map(i => ({ productoId: i.productoId, cantidad: i.cantidad }))
    };

    this.pedidoService.crearPedido(payload).subscribe({
      next: () => {
        alert('Pedido creado con éxito');
        this.clienteNuevo = '';
        this.itemsPedido = [];
        this.cargarPedidos();
        this.cargarProductos(); // el stock cambió
      },
      error: (err) => {
        console.error('Error al crear pedido', err);
        alert(mensajeError(err, 'No se pudo crear el pedido.'));
      }
    });
  }
}
