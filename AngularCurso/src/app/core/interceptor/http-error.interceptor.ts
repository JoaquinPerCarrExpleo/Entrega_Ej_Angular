import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ControlatedError } from '@core/models/controlate-error.model';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const controlatedError = new ControlatedError();

        switch (error.status) {
          case 401:
            controlatedError.message = 'No autenticado';
            controlatedError.title = 'Unauthorized';
            break;
          case 400:
            controlatedError.message = 'No se puede procesar la solicitud porque tiene un formato incorrecto o es incorrecta.';
            controlatedError.title = 'Bad Request';
            break;
          case 403:
            controlatedError.message = 'Se denegó el acceso al recurso solicitado';
            controlatedError.title = 'Prohibido';
            break;
          case 404:
            controlatedError.message = 'El recurso solicitado no existe.';
            controlatedError.title = 'No encontrado';
            break;

          default:
            controlatedError.title = 'Error inesperado';
            break;
        }

        return throwError(() => controlatedError);
      })
    );
  }
}
