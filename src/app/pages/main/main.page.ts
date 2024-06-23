import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from './../../services/utils.service';
import { FirebaseService } from './../../services/firebase.service';
import { User } from './../../models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
  ];

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  router = inject(Router);
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  signOut() {
    this.firebaseService.singOut();
  }
}
