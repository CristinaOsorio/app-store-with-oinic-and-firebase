import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      this.firebaseService
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          this.utilsService.presentToast({
            message: 'Correo enviado con éxito',
            duration: 1500,
            color: 'primary',
            position: 'middle',
            icon: 'mail-outline',
          });

          this.utilsService.routerLink('/auth');
          this.form.reset();
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
