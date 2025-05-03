import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // ✅ Add this
import { routes } from './app.routes';            // ✅ Add this
import { jwtInterceptor } from './services/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes) // ✅ Register your routes here
  ]
};
