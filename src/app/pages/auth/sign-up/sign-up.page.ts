import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from './../../../services/firebase.service';
import { UtilsService } from './../../../services/utils.service';
import { User } from './../../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
        .signUp(this.form.value as User)
        .then(async (res) => {
          await this.firebaseService.updateUser(this.form.value.name);
          console.log(res);
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
