import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router }  from '@angular/router';
import { AuthService } from './auth.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class VerificarJwtService implements CanActivate  {

  constructor( private router: Router, private auth: AuthService ) {
     // console.log('isLogued()', auth.isLogued());
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {

      //
        const url: string = state.url;
         // console.log('url dentro de canActivate', url);
         // console.log(route);
         // console.log(state);
        if ( this.auth.isLogued() ) {
            const token = localStorage.getItem('token');
            // console.log(tokenPayload);
            // decode the token to get its payload
             const tokenPayload = jwt_decode(token);
             // console.log(tokenPayload.data);
             // if (tokenPayload.data.rol !== 'cliente' || tokenPayload.data.rol !== 'admin') { // return false;    }
          return true;
        } else {
          this.router.navigate(['/inicio']);
          return !true;
        }
  }
}