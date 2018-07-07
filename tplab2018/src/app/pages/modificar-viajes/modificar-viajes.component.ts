import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {  MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapDirective } from '../../google-map.directive';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicio/usuario.service';
import { Viaje } from '../../clases/viaje';
import {} from '@types/googlemaps';

declare const  google: any;
declare const  jQuery: any;

@Component({
  selector: 'app-modificar-viajes',
  templateUrl: './modificar-viajes.component.html',
  styleUrls: ['./modificar-viajes.component.css'],
  providers : [ GoogleMapsAPIWrapper ]
})
export class ModificarViajesComponent implements OnInit {

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
    //Get Directions
    public dir:any;
    selectedEntry;
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
  }

  ngOnInit() {
    this.buscarTodos();
  
    this.viajeSolicitado = false;
    this.mostrarLista = true;

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

//  Traigo todas las personas
buscarTodos() {
    this.service.traerViajes().then( 
      data => { 
        this.mostrarLista = true; 
        this.arrayViajes = data; 
      }).catch( 
        error => { console.log(error); 
      });
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
    console.log("modifico direcciones");
  }

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
/*DibujarRuta(){
    this.gmapsApi.getNativeMap().then(map =>{

      this.origin = new google.maps.LatLng({lat: this.datosMostrar.lat_o,lng: this.datosMostrar.lng_o });
      this.destination = new google.maps.LatLng({lat:this.datosMostrar.lat_d,lng:this.datosMostrar.lng_d });

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
      //directionsDisplay.setMap(map);
      console.log("Dibujo la ruta");
    
    directionsService.route({
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.vc.updateDirections();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
});
}*/

}