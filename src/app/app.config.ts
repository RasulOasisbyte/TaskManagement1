import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';

export const appConfig = {
  providers: [
    provideAnimations(),
    providePrimeNG()
  ]
};
