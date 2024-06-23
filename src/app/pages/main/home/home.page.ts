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

  addUpdateProduct() {
    this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
    });
  }
}
