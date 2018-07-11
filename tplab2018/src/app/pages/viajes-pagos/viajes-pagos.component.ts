import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import { Viaje } from '../../clases/viaje';

@Component({
  selector: 'app-viajes-pagos',
  templateUrl: './viajes-pagos.component.html',
  styleUrls: ['./viajes-pagos.component.css']
})
export class ViajesPagosComponent implements OnInit {

  public arrayViajes;
  valor : number = 0;

  constructor(private service: UsuarioService) { 
    this.arrayViajes = new Array<any>();
  }

  ngOnInit() {
    this.buscarTodos();
  }
  Valor(numero){

    this.valor= numero;
  }
  buscarTodos() {
    this.service.traerViajes().then( 
      data => { 
        //this.mostrarLista = true; 
        this.arrayViajes = data; 
      }).catch( 
        error => { console.log(error); 
      });
}
}
