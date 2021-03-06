import { Component, OnInit, Input , ViewChild, Output, EventEmitter } from '@angular/core';
import { Vehiculo } from '../../clases/vehiculo';
import { UsuarioService } from '../../servicio/usuario.service';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  
    @Input() arrayVehiculos: Array<any>;
    @ViewChild('modal')
    modal: BsModalComponent;
    public verLista: boolean;
    @Input() arrayRemos: Array<any>;
    vehiculo: Vehiculo;
    public miVehiculo = new Vehiculo('', '', '', '', -1);
    error = '';
    datosMostrar: any = {};
    public modificado: boolean;
    public enviado: boolean;
    loader: boolean;

    constructor(private ws: UsuarioService) {
        this.arrayVehiculos = new Array<any>();
        this.arrayRemos = new Array<any>();
        this.loader = true;
    }

    ngOnInit() {
      setTimeout(()=>{ 
        this.loader = false;
      }, 3000);
      this.buscarTodos();
      this.remiseros();
      this.modificado = false;
      this.enviado = false;
    }
    public habilitar(boleano) {
      if (boleano) {
          this.miVehiculo.habilitado = 1;
      } else {
          this.miVehiculo.habilitado = 0;
      }
    }
    remiseros() {

      this.ws.traerObj('/usuario/remo/')
      .then( data => {
          this.arrayRemos = data;
          console.log(data);
      })
      .catch( error => { console.log(error); });
  }
    submit() {
        const registro = new Vehiculo(
        this.miVehiculo.patente,
        this.miVehiculo.marca,
        this.miVehiculo.categoria,
        this.miVehiculo.ocupantes,
        this.miVehiculo.usuario_id
    );
      this.ws.enviarObj(registro,'/vehiculo/').subscribe(
         data => {
           //this.verLista= true;
           this.enviado = true;
           this.buscarTodos();
           console.log(data);
         },
         error => {
          this.error = error;
           console.error('Error guardando un vehiculo');
         }
      );
    }
    public cargarObjeto($id){
      this.modal.dismiss();
      this.ws.traerObjId($id,'/vehiculo/').subscribe( 
        data => { 
          this.datosMostrar = data; 
          console.log(data);
        },error => console.log(error)
      )
      
    }
    public eliminarObjeto($user)
    {
      this.ws.enviarObj($user,'/vehiculo/borrar/')
        .subscribe( data => {
          this.buscarTodos();
        },error => console.log(error)
      )
    }
    
    public modificarVehiculo(){
      
      this.ws.enviarObj(this.datosMostrar,'/vehiculo/modificar/')
      .subscribe( data => {
          this.modificado = true;
          this.buscarTodos();
        },error => console.log(error)
      )
    }
  buscarTodos() {
    this.ws.traerObj('/vehiculo/').then( 
      data => { 
        this.arrayVehiculos = data;
      }).catch( 
        error => { 
          console.log(error); 
      });
  
  }

}
