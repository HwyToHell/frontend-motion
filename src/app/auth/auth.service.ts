import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/";


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
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key= AIzaSyAmsO3Ax4RA-755vMkYB1_L1cjQJ-jnI8o',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    // error conversion logic moved to service
    ).pipe(catchError(errorRes => {
      let errorMsg = 'unknown Error';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMsg);
      }
      errorMsg = 'Error: ' + errorRes.error.error.message;
      return throwError(errorMsg);
    }));
  }

}
