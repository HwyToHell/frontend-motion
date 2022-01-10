import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

 @Component({
   selector: 'app-auth',
   templateUrl: './auth.component.html'
 })

 export class AuthComponent {
   error: string = null;

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) { return; }

    const email = form.value.email;
    const password = form.value.password;
    //console.log(form.value);

    this.authService.login(email, password).subscribe(res => {
      console.log(res);
      this.error = null;
    },
    errorMsg => {
      console.log(errorMsg);
      this.error = errorMsg;
    });

    form.reset();
  }

 }
