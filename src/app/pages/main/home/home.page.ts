import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from './../../../services/firebase.service';
import { UtilsService } from './../../../services/utils.service';
import { AddUpdateProductComponent } from './../../../shared/components/add-update-product/add-update-product.component';
import { User } from './../../../models/user.model';
import { Product } from './../../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  products: Product[] = [];

  ngOnInit() {}

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  getProducts() {
    let path = `users/${this.user().uid}/products`;

    let sub = this.firebaseService.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.products = res;
        sub.unsubscribe();
      },
    });
  }

  async addUpdateProduct(product?: Product) {
    const success = await this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        product,
      },
    });

    if (success) this.getProducts();
  }

  async confirmDeleteProduct(product: Product) {
    this.utilsService.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsService.loading();
    await loading.present();

    let imagePath = await this.firebaseService.getFilePath(product.image);

    await this.firebaseService.deleteFile(imagePath);

    this.firebaseService
      .deleteDocument(path)
      .then(async (res) => {
        this.products = this.products.filter((p) => p.id !== product.id);

        this.utilsService.presentToast({
          message: 'Producto eliminado exitosamente',
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
