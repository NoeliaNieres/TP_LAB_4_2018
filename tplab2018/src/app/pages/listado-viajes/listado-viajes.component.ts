import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-listado-viajes',
  templateUrl: './listado-viajes.component.html',
  styleUrls: ['./listado-viajes.component.css']
})
export class ListadoViajesComponent implements OnInit {

  public arrayViajes;
  loader: boolean;
  token: any;
  tokenPayload: any;
  public tipoMenu: any;

  valor : number = 0;

  constructor(private router: Router, private ws: UsuarioService) {
    this.loader = true;
    this.arrayViajes = new Array<any>();
  }


  ngOnInit() {
    setTimeout(()=>{ 
      this.loader = false;
    }, 3000);
    this.buscarTodos();
  }
  Valor(numero){

    this.valor= numero;
  }

  buscarTodos() {

    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      this.tokenPayload = jwt_decode(this.token);
      if (null !== this.tokenPayload.data.email) {
        this.ws.traerViajes().then( 
          data => { 
            //this.mostrarLista = true; 
            this.arrayViajes = data; 
          }).catch( 
            error => { console.log(error); 
          });
          
      }
    }
  }

}
