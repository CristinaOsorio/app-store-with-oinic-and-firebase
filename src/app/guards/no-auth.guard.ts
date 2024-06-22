import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const utilsService = inject(UtilsService);
  const user = utilsService.getFromLocalStorage('user');
  return new Promise((resolve) => {
    firebaseService.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        return resolve(true);
      }

      utilsService.routerLink('/main/home');
      resolve(false);
    });
  });
};
