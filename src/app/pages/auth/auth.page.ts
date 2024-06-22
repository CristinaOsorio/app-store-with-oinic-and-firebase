import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './../../services/firebase.service';
import { UtilsService } from './../../services/utils.service';
import { User } from './../../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      this.firebaseService
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((errors) => {
          this.utilsService.presentToast({
            message: errors.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => loading.dismiss());
    }
  }
  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseService
        .getDocument(path)
        .then(async (user: User) => {
          this.utilsService.setInLocalStorage('user', user);
          this.utilsService.routerLink('/main/home');
          this.form.reset();

          this.utilsService.presentToast({
            message: `Te damos la bienvenida ${user.name}`,
            duration: 1500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((errors) => {
          this.utilsService.presentToast({
            message: errors.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => loading.dismiss());
    }
  }
}
