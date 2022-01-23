import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

 @Component({
   selector: 'app-auth',
   templateUrl: './auth.component.html'
 })

 export class AuthComponent {
   error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onChangeRoute() {
    //console.log("change route");
    this.router.navigate(['/video-list']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { return; }

    const email = form.value.email;
    const password = form.value.password;
    //console.log(form.value);

    this.authService.login(email, password).subscribe(res => {
      //console.log(res);
      this.error = null;
      // navigate only after login has been successfully finished
      this.router.navigate(['/video-list']);
    },
    errorMsg => {
      console.log(errorMsg);
      this.error = errorMsg;
    });

    form.reset();
  }

 }
