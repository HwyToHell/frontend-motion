import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, TimeInterval } from "rxjs/";
import { User } from "./user.model";
import { Router } from "@angular/router";


interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string,
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new Subject<User>();
  private tokenExpirationTimer_: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key= AIzaSyAmsO3Ax4RA-755vMkYB1_L1cjQJ-jnI8o',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    // error conversion logic moved to service
    ).pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuth(res.email, res.localId, res.idToken, +res.expiresIn);
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      token_: string,
      tokenExpirationDate_: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.token_,
      new Date(userData.tokenExpirationDate_)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.tokenExpirationDate_).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
      //console.log('token of loaded user', loadedUser.token);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer_) {
      clearTimeout(this.tokenExpirationTimer_);
    }
    this.tokenExpirationTimer_ = null;
  }

  // expirationDuration in ms
  autoLogout(expirationDuration: number) {
    //console.log(expirationDuration);
    this.tokenExpirationTimer_ = setTimeout(() => {
      this.logout();
    //}, 2000);
    }, expirationDuration);
  }


  isAuthenticated(): boolean {
    return !!this.tokenExpirationTimer_;
  }

  // expiresIn in sec
  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'unknown Error';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }
    errorMsg = 'Error: ' + errorRes.error.error.message;
    return throwError(errorMsg);
  }


}
