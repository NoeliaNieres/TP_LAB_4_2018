import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {  MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapDirective } from '../../google-map.directive';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import { Viaje } from '../../clases/viaje';
import {} from '@types/googlemaps';
import { BsModalComponent } from 'ng2-bs3-modal';
import * as jwt_decode from 'jwt-decode';

declare const  google: any;
declare const  jQuery: any;

@Component({
  selector: 'app-modificar-viajes',
  templateUrl: './modificar-viajes.component.html',
  styleUrls: ['./modificar-viajes.component.css'],
  providers : [ GoogleMapsAPIWrapper ]
})
export class ModificarViajesComponent implements OnInit {

    @ViewChild('modal')
    modal: BsModalComponent;
    private mostrarLista: boolean;
    datosMostrar: any = {};
    direccionMostrar: any = {};
    public latitude: number;
    public longitude: number;
    public destinationInput: FormControl;
    public destinationOutput: FormControl;
    public destInput: FormControl;
    public destOutput: FormControl;
    public zoom: number;
    public iconurl: string;
    public mapCustomStyles: any;
    public estimatedTime: any;
    public estimatedDistance: any;
    public startDate: any;
    public fechaViaje: any;
    public metodoPago: any;
    public nivel:any;
    private origenLat: any;
    private origenLng: any;
    private destinoLat: any;
    private destinoLng: any;
    private objViaje: Viaje;
    public viajeSolicitado: boolean;
    public viajeModificar: boolean = true;
    public arrayViajes;
    public direOrigen;
    public direDest;
    @Input() arrayAutos: Array<any>;
    public showHide:boolean = false;
    public dir:any;
    selectedEntry;
    private token: any;
    private tokenPayload: any;
    private vehiculo_id: any;
    loader: boolean;
    
    onSelectionChange(entry) {
        this.selectedEntry = entry;
    }
    @ViewChild('pickupInput') pickupInputElementRef: ElementRef;

    @ViewChild('pickupOutput') pickupOutputElementRef: ElementRef;

    @ViewChild('scrollMe')
    private scrollContainer: ElementRef;

    @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

    public origin: any ; // its a example aleatory position
    public destination: any; // its a example aleatory position

  constructor(private service: UsuarioService,private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private gmapsApi: GoogleMapsAPIWrapper,
    private _elementRef: ElementRef) {
      this.arrayViajes = new Array<any>();
      this.loader = true;
  }

  ngOnInit() {
    setTimeout(()=>{ 
      this.loader = false;
    }, 3000);
    this.buscarTodos();
  
    this.viajeSolicitado = false;
    this.mostrarLista = true;
    this.arrayAutos = new Array<any>();
    this.cargarAutos();
    this.destinationInput = new FormControl();
    this.destinationOutput = new FormControl();

    this.mapsAPILoader.load().then(() => {
        const autocompleteInput = new google.maps.places.Autocomplete(this.pickupInputElementRef.nativeElement, {
            types: ['address']
        });

        const autocompleteOutput = new google.maps.places.Autocomplete(this.pickupOutputElementRef.nativeElement, {
            types: ['address']
        });
        this.setupPlaceChangedListener(autocompleteInput, 'ORG');
        this.setupPlaceChangedListener(autocompleteOutput, 'DES');
    });
}
scrollToBottom(): void {
  jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 3000);
}
private setupPlaceChangedListener(autocomplete: any, mode: any ) {
    autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
        // get the place result
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
         // verify result
        if (place.geometry === undefined) {
            return;
        }
        if (mode === 'ORG') {
            this.vc.origin = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() };
            this.vc.originPlaceId = place.place_id;
        } else {
            this.vc.destination = {
                longitude: place.geometry.location.lng(),
                latitude: place.geometry.location.lat()
            }; // its a example aleatory position
            this.vc.destinationPlaceId = place.place_id;
        }

         if (this.vc.directionsDisplay === undefined) {
                this.mapsAPILoader.load().then(() => {
                 this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
             });
       }

         // Update the directions
         this.vc.updateDirections();
         this.zoom = 12;
         // this.getDistanceAndDuration();
         if (this.vc.destination !== undefined ) {
            this.origenLat = this.vc.origin.latitude;
            this.origenLng = this.vc.origin.longitude;
            this.destinoLat = this.vc.destination.latitude;
            this.destinoLng = this.vc.destination.longitude;
         }

         // this.estimatedTime = localStorage.getItem('duracion');
         // this.estimatedTime = '1000 km';
       });

    });

}
buscarDirOrig(lat,lng){
  this.service.getDireccion(lat,lng).then( 
    data => { 
      //console.log(data);
     this.direOrigen = data.results["0"].formatted_address;
    }).catch( 
      error => { console.log(error); 
    });

}
buscarDirDest(lat,lng){
  this.service.getDireccion(lat,lng).then( 
    data => { 
      this.direDest = data.results["0"].formatted_address;
    }).catch( 
      error => { console.log(error); 
    });
}
cargarAutos() {

  this.service.traerObj('/vehiculo/habilitados/')
  .then( data => {
      this.arrayAutos = data;
  })
  .catch( error => {
      console.log(error);
  });
}
//  Traigo todos los viajes o solo los del cliente
buscarTodos() {

  this.token = localStorage.getItem('token');
  if (this.token !== null) {
    this.tokenPayload = jwt_decode(this.token);
    if (null !== this.tokenPayload.data.email) {
        this.service.traerViajesId(this.tokenPayload.data.id)
        .subscribe( 
          data => {
             console.log(data);
            if (data !== null) {
                this.mostrarLista = true; 
                this.arrayViajes = data;
              }

        },error => console.log(error)
      )
        
    }
  }
}
handleSelectedValue(value) {
  // Get and value and assign it to variable declared above 
    if(value == '1')
     this.showHide = true;
 
 }

cargarObjeto($id){
  this.viajeSolicitado = false;
  this.service.traerUnViajeId($id).subscribe( 
    data => { 
      this.mostrarLista = true; 
      this.datosMostrar = data; 
      this.buscarDirOrig(this.datosMostrar.lat_o,this.datosMostrar.lng_o);
      this.buscarDirDest(this.datosMostrar.lat_d,this.datosMostrar.lng_d);
      this.getDirection();
     
    },error => console.log(error)
  )
}
eliminarObjeto($viaje)
{
  this.service.borrarViaje($viaje,'/viaje/borrar/')
    .then( data => {
      this.viajeSolicitado = true;
      this.buscarTodos();
    })
    .catch( e => {
      console.log(e);
    } );
}
public getDirection(){
  this.dir = {
    origin: { lat: this.datosMostrar.lat_o, lng:this.datosMostrar.lng_o },
    destination: { lat: this.datosMostrar.lat_d, lng:this.datosMostrar.lng_d  }
  }
}
public modificarViaje(){

  if(this.viajeModificar === false){
    this.datosMostrar.lat_o = this.origenLat;
    this.datosMostrar.lng_o = this.origenLng;
    this.datosMostrar.lat_d = this.destinoLat;
    this.datosMostrar.lng_d = this.destinoLng;
    this.datosMostrar.duracion =this.estimatedTime;
    this.datosMostrar.distancia =this.estimatedDistance;
    console.log("modifico direcciones");
  }
  console.log(this.datosMostrar);
  this.service.modViaje(this.datosMostrar,'/viaje/modificar/')
  .then( data => {
      this.viajeSolicitado = true;
      this.buscarTodos();
 })
 .catch( e => {
     console.log(e);
 } );
 this.viajeModificar = true;
}
getDistanceAndDuration(){
  let tiempo = this.vc.estimatedTime;
  let distancia = this.vc.estimatedDistance;

  var d = distancia.toString().replace("km","");
  var t = tiempo.toString().replace("min","");
  this.estimatedDistance =d;
  this.estimatedTime =t;
}
getDataForTable($event: any) {
  this.getDistanceAndDuration();
}


}