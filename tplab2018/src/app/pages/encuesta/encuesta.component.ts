import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { UsuarioService } from '../../servicio/usuario.service';
import { Encuesta } from '../../clases/encuesta';
import { GrowlModule, Message } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/fileupload';
import {GalleriaModule} from 'primeng/galleria';

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
  misImagenes: any = {};
  loader: boolean;

  constructor(private router: Router, private ws: UsuarioService) {
    this.ocultarSpinner = true;
    this.loader = true;
  }

  ngOnInit() {
    setTimeout(()=>{ 
      this.loader = false;
    }, 3000);
    this.miEncuesta = new Encuesta();
    this.encuestaCargada = false;
    this.respuesta_5 = -1;
    this.cargarImagenes();
  }
     // 1- RADAR
     public radarChartLabels:string[] = ['Tiempo', 'Atención brindada', 'Calidad', 'Confianza', 'Gusto', 'Choferes', 'Otras'];
     public radarChartData:any = [
       {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
       {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
     ];
      // 2- PIE
     public radarChartType:string = 'radar';
     public pieChartLabels:string[] = ['Clientes', 'Empleados', 'Encargado',"Administrador"];
     public pieChartData:number[] = [45, 10, 62,63];
     public pieChartType:string = 'pie';

    // 3- AREA POLAR
    public polarAreaChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    public polarAreaChartData:number[] = [10, 11, 14, 13, 12];
    public polarAreaLegend:boolean = true;
    public polarAreaChartType:string = 'polarArea';
    // 4- ROSQUILLA
    public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    public doughnutChartData:number[] = [350, 450, 100];
    public doughnutChartType:string = 'doughnut';
      //EVENTOS
  public chartClicked(e:any):void {console.log(e);} //SOLO MUESTRA EVENTO!
 
  public chartHovered(e:any):void {console.log(e);}//SOLO MUESTRA EVENTO!

  onSelect(event: any, pfuReference: any) {
    var modelo = this;
    pfuReference.auto = false;
    this.ocultarSpinner = false;
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
           this.encuestaCargada = true;
          //this.router.navigateByUrl('/inicio');
        },
        error => {
          console.log(error);
          console.error('Error guardando una encuesta.');
        }
      );
  }
  onImageClicked(event)
  {
    console.log(event);
  }
  cargarImagenes()
  {
    this.ws.TraerFotos().subscribe(
      data =>{
        console.log(data[0]);
        this.misImagenes = data[0];
        if(this.misImagenes.length > 0){
          this.images = [];
          for(let i=0;i<this.misImagenes.length;i++)
          {
            this.images.push({source:'http://localhost:8080/fotos/'+this.misImagenes[i], alt:'Imagen del Usuario', title:'Imagen '+i});
          }
        }
      },
        error =>{
          console.log(error);
        }
    );
  }

}
