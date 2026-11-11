import { Component, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';
import { mensajeError } from '../../core/utils/error.util';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoFormComponent {
  private productoService = inject(ProductoService);

  productoGuardado = output<void>();

  // Objeto base para el formulario
  producto = signal<Producto>(this.productoVacio());

  private productoVacio(): Producto {
    return {
      precio: 0.01,
      stock: 0,
      categoria: '',
      nombre: '',
      marca: '',
      codigoBarras: ''
    };
  }

  editarProducto(productoSeleccionado: Producto) {
    this.producto.set({ ...productoSeleccionado });
  }

  guardar() {
    const datosProducto = this.producto();

    if (datosProducto.precio <= 0 || datosProducto.stock < 0) {
      alert('Por favor verifique que el precio sea mayor a 0 y el stock no sea negativo.');
      return;
    }

    if (datosProducto.id) {
      this.productoService.actualizarProducto(datosProducto.id, datosProducto)
        .subscribe({
          next: () => {
            this.productoGuardado.emit();
            this.limpiarFormulario();
          },
          error: (error) => {
            console.error('Error al actualizar el producto', error);
            alert(mensajeError(error, 'No se pudo actualizar el producto.'));
          }
        });
    } else {
      this.productoService.crearProducto(datosProducto)
        .subscribe({
          next: () => {
            this.productoGuardado.emit();
            this.limpiarFormulario();
          },
          error: (error) => {
            console.error('Error al crear el producto', error);
            alert(mensajeError(error, 'No se pudo crear el producto.'));
          }
        });
    }
  }

  limpiarFormulario() {
    this.producto.set(this.productoVacio());
  }
}
