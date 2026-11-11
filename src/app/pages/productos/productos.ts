import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';
import { ProductoFormComponent } from '../producto-form/producto-form';
import { mensajeError } from '../../core/utils/error.util';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ProductoFormComponent],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);

  @ViewChild(ProductoFormComponent) formulario!: ProductoFormComponent;

  productos = signal<Producto[]>([]);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  editar(producto: Producto): void {
    this.formulario.editarProducto(producto);
  }

  eliminar(producto: Producto): void {
    if (!producto.id || !confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    this.productoService.eliminarProducto(producto.id).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => {
        console.error('Error al eliminar el producto', err);
        alert(mensajeError(err, 'No se pudo eliminar el producto. Puede estar asociado a un pedido.'));
      }
    });
  }
}
