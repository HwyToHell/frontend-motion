import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  isLoggedIn: boolean = false;
  private userSub_: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub_ = this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
      //console.log('user' , !!user);
    });
    this.authService.autoLogin();
  }

  ngOnDestroy(): void {
    this.userSub_.unsubscribe();
  }

  onExpand() {
    this.isExpanded = !this.isExpanded;
    //console.log("expanded:", this.isExpanded);
  }

  onLogout() {
    this.authService.logout();
  }

}
