import { Component, OnInit, inject } from '@angular/core';
import { User } from './../../../models/user.model';
import { UtilsService } from './../../../services/utils.service';
import { FirebaseService } from './../../../services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  ngOnInit() {}

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  async takeImage() {
    const user = this.user();
    const path = `users/${user.uid}`;

    const dataUrl = (await this.utilsService.takePicture('Imagen de perfil'))
      .dataUrl;

    const loading = await this.utilsService.loading();
    await loading.present();

    const imagePath = `${user.uid}/profile`;

    user.image = await this.firebaseService.uploadImage(imagePath, dataUrl);

    this.firebaseService
      .updateDocument(path, { image: user.image })
      .then(async (res) => {
        this.utilsService.setInLocalStorage('user', user);

        this.utilsService.presentToast({
          message: 'Imagen actualizada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
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
