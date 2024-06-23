import { UtilsService } from 'src/app/services/utils.service';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const utilsService = inject(UtilsService);
  const user = utilsService.getFromLocalStorage('user');
  return new Promise((resolve) => {
    firebaseService.getAuth().onAuthStateChanged((auth) => {
      if (auth && user) {
        return resolve(true);
      }

      firebaseService.singOut();
      resolve(false);
    });
  });
};
