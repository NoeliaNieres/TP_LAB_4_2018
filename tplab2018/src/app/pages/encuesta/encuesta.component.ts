import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { UsuarioService } from '../../servicio/usuario.service';
import { Encuesta } from '../../clases/encuesta';
import { GrowlModule, Message } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  private miEncuesta: Encuesta;
  public respuesta_1: any;
  public respuesta_2: any;
  public respuesta_3: any;
  public respuesta_4: any;
  public respuesta_5: any;
  public respuesta_6: any;
  public respuesta_7: any;
  public respuesta_8: any;
  msgs: Message[];

  uploadedFiles: any[] = [];

  private encuestaCargada: boolean;
  token: any;
  tokenPayload: any;
  public tipoMenu: any;
  usuario: any;

  images: any[];

  ocultarSpinner: boolean;

  private sub: any;
  misImagenes: Array<any>;

  constructor(private router: Router, private ws: UsuarioService) {

  }

  ngOnInit() {
    this.miEncuesta = new Encuesta();
    this.encuestaCargada = false;
    this.respuesta_5 = -1;
  }
  onSelect(event: any, pfuReference: any) {
    var modelo = this;
    pfuReference.auto = false;
    if (event.files.length >= 4) {
      console.log("error");
      setTimeout(function () {
        modelo.msgs = [];
        modelo.msgs.push({ severity: 'error', summary: 'Imagenes!', detail: 'Solo se pueden subir 3 fotos!' });
        modelo.ocultarSpinner = true;
      }, 1000);
      pfuReference.clear();
      pfuReference.auto = true;
      return;
    } else {
      console.log("si");
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }
      console.log(this.uploadedFiles);
      console.log(event);
      
      pfuReference.auto = true;
      pfuReference.upload();
      setTimeout(function () {
        modelo.msgs = [];
        modelo.msgs.push({ severity: 'info', summary: 'Imagenes subidas!', detail: 'Se ha completado la subida' });
        modelo.ocultarSpinner = true;
      }, 5000);
    }
  }

  Comprobar() {
    this.token = localStorage.getItem('token');
    //console.log(this.token);
    if (this.token !== null) {
      this.tokenPayload = jwt_decode(this.token);
      if ('admin' === this.tokenPayload.data.rol) {
        this.tipoMenu = 1;
      } else if ('encargado' === this.tokenPayload.data.rol) {
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
  cargarEncuesta() {

    this.miEncuesta.respuesta_1 = this.respuesta_1;
    this.miEncuesta.respuesta_2 = this.respuesta_2;
    this.miEncuesta.respuesta_3 = this.respuesta_3;
    this.miEncuesta.respuesta_4 = this.respuesta_4;
    this.miEncuesta.respuesta_5 = this.respuesta_5;
    this.miEncuesta.respuesta_6 = this.respuesta_6;
    this.miEncuesta.respuesta_7 = this.respuesta_7;
    this.miEncuesta.respuesta_8 = this.respuesta_8;
    this.miEncuesta.token = localStorage.getItem('token');
    console.log(this.miEncuesta);
    this.ws.postEncuesta(this.miEncuesta, '/encuesta/')
      .subscribe(
        data => {
          console.log(data);
          // this.encuestaCargada = true;
          this.router.navigateByUrl('/inicio');
        },
        error => {
          console.log(error);
          console.error('Error guardando una encuesta.');
        }
      );
  }

}
