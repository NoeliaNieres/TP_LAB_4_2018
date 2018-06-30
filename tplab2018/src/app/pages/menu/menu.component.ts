import { Component} from '@angular/core';
import { Usuario } from '../../clases/usuario';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import { AuthService } from '../../servicio/auth.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  token: any;
  tokenPayload: any;
  public tipoMenu: any;
  usuario:any;

  constructor(private router: Router,private auth:AuthService) { }

  Salir()
  {
    localStorage.clear();
    this.router.navigate(['/inicio']);
    this.Comprobar();
  }
  Comprobar() {
    this.token = localStorage.getItem('token');
    //console.log(this.token);
    if (this.token !== null) {
        this.tokenPayload = jwt_decode(this.token);
        if ('admin' === this.tokenPayload.data.rol) {
          this.tipoMenu = 1;
        } else if ('encargado' === this.tokenPayload.data.rol)  {
          this.tipoMenu = 2;
        } else if ('remisero' === this.tokenPayload.data.rol) {
          this.tipoMenu = 3;
        } else if ('cliente' === this.tokenPayload.data.rol) {
          this.tipoMenu = 4;
        } else {
          this.tipoMenu = 0;
        }
    } else {
      this.tipoMenu = 0;
    }
    return this.tipoMenu;
}
  ObtenerUsuario(){
      return this.tokenPayload.data.email;

  }

}