import { Component, OnInit,Input  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../servicio/usuario.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent{
  @Input() captchaElem: any;  

  email: string;
  clave: string;
  loading : boolean = false;
  returnUrl: string;
  user: Usuario = new Usuario('', '');
  error = '';
  loginScreenAnimation: string = 'unchecked';

  constructor(private router: Router,private ws: UsuarioService) {}

    public login() {
      //console.log(this.user);
      this.ws.login( this.user, '/usuario/' ).then( 
        data => {
            if ( data.token ) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.usuario));
                this.router.navigateByUrl('/inicio');
            }
        })
        .catch( e => {
          this.error = e;
        } );
    
}
  setBackToUnchecked() {
      if (this.loginScreenAnimation === 'invalid') {
          this.loginScreenAnimation = 'unchecked';
      }
  }

  Cargar(num) {
      switch (num) {
          case '1':
              this.user.email = 'admin@gmail.com';
              this.user.clave = '12345678a';
              break;
          case '2':
              this.user.email = 'remisero1@gmail.com';
              this.user.clave = '12345678a';
              break;
          case '3':
              this.user.email = 'encargado1@gmail.com';
              this.user.clave = '12345678a'
              break;
          case '4':
              this.user.email = 'admin';
              this.user.clave = 'admin'
              break;
      }
  }
  private handleSuccess(recaptchaSuccess: any) {
    localStorage.setItem('token_captcha', recaptchaSuccess);
  }

  private handleExpire(recaptchaSuccess: any) {
      // localStorage.setItem('token_captcha', recaptchaSuccess);
  }

  private handleLoad() {
      localStorage.setItem('token_captcha', null);
  }

}
