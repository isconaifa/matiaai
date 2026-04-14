import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injetamos o service para pegar o token do jeito certo
  const _authService = inject(AuthService);
  const token = _authService.getToken();

  // Se o token existir, "carimbamos" a requisição
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  // Se não houver token, segue o fluxo normal
  return next(req);
};