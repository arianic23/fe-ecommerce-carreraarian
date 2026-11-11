export interface ProductoDetalle {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export interface DetallePedidoItem {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: ProductoDetalle;
}

export interface PedidoItemEnvio {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  id?: number;
  cliente: string;
  montoTotal?: number;
  fechaCompra?: string;
  items?: PedidoItemEnvio[];      // Usado para crear
  detalles?: DetallePedidoItem[]; // Usado para mostrar listados
}
