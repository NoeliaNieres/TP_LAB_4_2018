import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-ver-mis-viajes',
  templateUrl: './ver-mis-viajes.component.html',
  styleUrls: ['./ver-mis-viajes.component.css']
})
export class VerMisViajesComponent implements OnInit {

  public arrayViajes;
  loader: boolean;
  token: any;
  tokenPayload: any;
  public tipoMenu: any;

  constructor(private router: Router, private ws: UsuarioService) {
    this.loader = true;
  }


  ngOnInit() {
    setTimeout(()=>{ 
      this.loader = false;
    }, 3000);
    this.buscarTodos();
  }
  buscarTodos() {

    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      this.tokenPayload = jwt_decode(this.token);
      if (null !== this.tokenPayload.data.email) {
          this.ws.traerViajesIdTodos(this.tokenPayload.data.id)
          .subscribe( 
            data => {
               console.log(data);
              if (data !== null) {
                  this.arrayViajes = data;
                }
  
          },error => console.log(error)
        )
          
      }
    }
  }

}
