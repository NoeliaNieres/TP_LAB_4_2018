import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { User } from '../../clases/user';
import * as jwt_decode from 'jwt-decode';
import { UsuarioService } from '../../servicio/usuario.service';
import { Router }  from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-usuario-abm',
  templateUrl: './usuario-abm.component.html',
  styleUrls: ['./usuario-abm.component.css']
})
export class UsuarioAbmComponent implements OnInit {

  public model = new User(0, '', '', '', '');
  error = '';
  @Input() arrayUsuarios: Array<any>;
  @ViewChild('modal')
  modal: BsModalComponent;
  datosMostrar: any = {};
  public verLista: boolean;
  public modiPersona: boolean;
  public modificado: boolean;
  token: any;
  tokenPayload: any;
  options = {
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: ',',
    showLabels: true,
    showTitle: false,
    useBom: true,
    headers: ['ID','Nombre', 'Mail', 'Rol']
  };
  data : any = {};

  constructor(private ws: UsuarioService,private router: Router) { 
    this.arrayUsuarios = new Array<any>();
    this.data = this.arrayUsuarios;
  }
  
  ngOnInit() {
    this.buscarTodos();
    this.modificado = false;
  }

  submit() {
    const registro = new User('',this.model.username,
                              this.model.email,this.model.rol,
                              this.model.password);
    this.ws.agregarPersona('/agregar/', registro).subscribe(
       data => {
         this.verLista= true;
        this.buscarTodos();
       },
       error => {
        this.error = error;
         console.error('Error guardando una usuario');
      
       }
    );
  }
  desPdf(){
   var doc = new jsPDF();
   var col = ['ID','Nombre', 'Mail', 'Rol']
   var rows = [];

  var itemNew = this.data;

  itemNew.forEach(element => {      
      var temp = [element.id,element.username,element.email,element.rol];
      rows.push(temp);
   
  });        

      doc.autoTable(col, rows, { startY: 10 });

      doc.save('listado.pdf');
  }
  buscarTodos() {
    this.token = localStorage.getItem('token');
    if (this.token !== null) {
        this.tokenPayload = jwt_decode(this.token);
        if ('encargado' === this.tokenPayload.data.rol) {

            this.ws.traerPersonas('/usuario/roles/')
            .then( data => {
                this.arrayUsuarios = data;
                this.data = data;
            })
            .catch( error => { console.log(error); });
        }

    } else {
        this.ws.traerPersonas('/usuario/').then( 
          data => { 
            this.arrayUsuarios = data; 
          }).catch( 
            error => {
               console.log(error); 
        });
    }

}

public cargarObjeto($id){
  this.modal.dismiss();
  this.ws.traerUnPersonaeId($id).subscribe( 
    data => { 
      this.modiPersona = true; 
      this.datosMostrar = data; 

    },error => console.log(error)
  )
}
public eliminarObjeto($user)
{
  this.ws.borrarUsuario('/borrar/',$user)
    .subscribe( data => {
      this.buscarTodos();
    },error => console.log(error)
  )
}
public modificarPersona(){
  this.verLista = true;
  this.ws.modificarUsuario('/modificar/',this.datosMostrar)
  .subscribe( data => {
      this.modificado = true;
      this.buscarTodos();
    },error => console.log(error)
  )
}

}
