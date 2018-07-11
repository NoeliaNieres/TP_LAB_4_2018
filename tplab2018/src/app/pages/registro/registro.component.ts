import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { User } from '../../clases/user';
import * as jwt_decode from 'jwt-decode';
import { UsuarioService } from '../../servicio/usuario.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public model = new User(0, '', '', '', '');
  error = '';
  resuelto;
  constructor(private ws: UsuarioService,private router: Router) { }

  ngOnInit() {
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    if (captchaResponse != null){
      this.resuelto = true;
    }
    else{ 
      this.resuelto = false;
    }

    this.verificar();
  }
  verificar(){
    if (this.resuelto !== true) {
      console.log(false);
      return false;
    } 
    console.log(true);
      return true;
  }

  submit() {
      const registro = new User('',this.model.username,
                                this.model.email,this.model.rol,
                                this.model.password);
      if ( this.verificar() === false) {
           this.error = "Debe tildar el catpcha para registrarse!!!";
      }else{
        this.ws.agregarPersona('/agregar/', registro).subscribe(
          data => {
            this.router.navigateByUrl('/login');
          },
          error => {
          this.error = error;
            console.error('Error guardando una usuario');
        
          }
      );
      }
  }

  
}
