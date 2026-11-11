import { HttpErrorResponse } from '@angular/common/http';

/** Convierte un error HTTP del backend (ErrorResponse) en un texto legible. */
export function mensajeError(err: unknown, porDefecto = 'Ocurrió un error inesperado.'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.';
    }
    const cuerpo = err.error;
    if (cuerpo && typeof cuerpo === 'object') {
      const detalles = cuerpo.errors
        ? Object.values(cuerpo.errors as Record<string, string>).join(' ')
        : '';
      const base = cuerpo.message ?? porDefecto;
      return detalles ? `${base} ${detalles}` : base;
    }
  }
  return porDefecto;
}
