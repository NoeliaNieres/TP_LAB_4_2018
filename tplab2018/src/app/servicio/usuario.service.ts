import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
//import { AuthHttp } from 'angular2-jwt';
import { User } from '../clases/user';
import { Viaje } from '../clases/viaje';

@Injectable()
export class UsuarioService {
  url= "http://localhost:8080";
  //url = "http://www.noe.epizy.com/back/index.php";

  constructor(public http: Http) { }

  login(user: Object, ruta: string) {
    //console.log(user);
    return this.http.post(this.url + ruta, user).toPromise()
    .then( this.extractData )
    .catch( this.handleError );
  }
  public agregarPersona( url: string, usuario: User ) {
    return this.http.post(this.url  + '/usuario' + url, usuario ).map((res: Response) => res.json());
  }
  public enviarViaje(viaje: Viaje, ruta: string) {
      console.log(viaje);
      return this.http.post(this.url + ruta, {viaje}).toPromise()
      .then( this.extractData )
      .catch( this.handleError );
  }
  public traerViajes() {
    return this.http.get( this.url  + '/viaje/').toPromise()
    .then( this.extractData )
    .catch( this.handleError );
  }
  public traerUnViajeId(id: number) {
    return this.http.get( this.url  + '/viaje/'+ id).map((response: Response) => response.json());
  }
  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }
  public getDireccion(lat, lng)
  {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng)
    .toPromise()
    .then( this.extractData )
    .catch( this.handleError );
  }
  public getlatlng(address){

    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    .toPromise()
    .then( this.extractData )
    .catch( this.handleError );
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error( errMsg );
    // console.error( 'CATCH' );
    return Observable.throw(errMsg);
  }

}
