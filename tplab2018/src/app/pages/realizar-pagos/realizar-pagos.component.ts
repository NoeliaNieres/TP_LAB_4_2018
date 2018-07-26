import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { UsuarioService } from '../../servicio/usuario.service';
import { Pago } from '../../clases/pago';

@Component({
  selector: 'app-realizar-pagos',
  templateUrl: './realizar-pagos.component.html',
  styleUrls: ['./realizar-pagos.component.css']
})
export class RealizarPagosComponent implements OnInit {

  token: any;
  tokenPayload: any;
  public tipoMenu: any;
  loader: boolean;
  @Input() arrayViajes: Array<any>;
  private mostrarLoader: boolean;
  private mostrarPagar: boolean;
  private pago = new Pago();
  private viaje: any;
  private mostrarCuentaCorriente: boolean;


  constructor(private router: Router, private ws: UsuarioService) {
    this.loader = true;
  }

  ngOnInit() {
    setTimeout(()=>{ 
      this.loader = false;
    }, 3000);
    this.buscarTodos();
    this.mostrarLoader = false;
  }
  buscarTodos() {

    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      this.tokenPayload = jwt_decode(this.token);
       if (null !== this.tokenPayload.data.email) {
         
        if('remisero' === this.tokenPayload.data.rol){
          this.ws.traerViajesRemisero(this.tokenPayload.data.id)
          .subscribe( 
            data => {
              console.log(data.viajes);
              if (data !== null) {
                this.arrayViajes = data.viajes;
              }
            },error => console.log(error)
          )
        }
      }
    }
  }
// Cancelo mi viaje como remisero
cancelarViaje(viaje) {

  this.ws.traerObj('/viaje/cancelar/' + viaje.id)
  .then( data => {
      if (data.cantidad > 0) {
          this.buscarTodos();
      }
  })
  .catch( error => {
      console.log(error);
  });

}

// Cancelo mi viaje como remisero
cerrarViaje(viaje) {
  // console.log(viaje);
  this.viaje = viaje.fechayhora + ' ' + viaje.duracion + ' ' + viaje.distancia;
  this.pago.cantidad = viaje.duracion * viaje.distancia;
  this.mostrarPagar = true;
  this.pago.viaje_id = viaje.id;
  this.pago.metodo = viaje.tipo_pago;
  this.pago.token = this.token;
  this.pago.cuenta = '';
  // console.log(this.pago);
}

/*
  crear la clase pago para la API
  hacer que cuando se haga post se guarde el Pago
  una vez genero del pago, hacer update de viajes
*/


pagarViaje() {


  this.ws.enviarObj(this.pago, '/pago/' )
  .subscribe(
     data => {
       this.buscarTodos();
       this.mostrarPagar = false;
       return true;
     },
     error => {
          console.log(error);
          console.error('Error al pagar el viaje');
          return false;
     }
  );

}

verificarMetodo(valor) {

  if ('2' === valor) {
      this.mostrarCuentaCorriente = true;
  } else {
      this.mostrarCuentaCorriente = false;
  }

}
 
}
