import { User } from './../../../models/user.model';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from './../../../services/firebase.service';
import { UtilsService } from './../../../services/utils.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl(null, [
      Validators.required,
      Validators.minLength(0),
    ]),
    soldUnits: new FormControl(null, [
      Validators.required,
      Validators.minLength(0),
    ]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;

    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.utilsService.loading();
    await loading.present();
    if (this.product.image !== this.form.value.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseService.getFilePath(
        this.product.image
      );

      let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Producto actualizado exitosamente',
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

  async createProduct() {
    let path = `users/${this.user.uid}/products`;

    const loading = await this.utilsService.loading();
    await loading.present();

    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);

    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseService
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Producto creado exitosamente',
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
