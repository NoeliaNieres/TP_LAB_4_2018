import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef, Directive, Input ,ChangeDetectorRef} from '@angular/core';
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
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css'],
  providers : [ GoogleMapsAPIWrapper ]
})
export class ViajesComponent implements OnInit {

    public latitude: number;
    public longitude: number;
    public destinationInput: FormControl;
    public destinationOutput: FormControl;
    public tiempoOutput: FormControl;
    public zoom: number;
    public iconurl: string;
    public mapCustomStyles: any;
    public estimatedTime: any;
    public estimatedDistance: any;
    public startDate: any;
    public fechaViaje: any;
    public metodoPago: any;
    public nivel: any;
    private origenLat: any;
    private origenLng: any;
    private destinoLat: any;
    private destinoLng: any;
    private objViaje: Viaje;
    public viajeSolicitado: boolean;
    display = false;
    @ViewChild('pickupInput') pickupInputElementRef: ElementRef;

    @ViewChild('pickupOutput') pickupOutputElementRef: ElementRef;

    @ViewChild('scrollMe')
    private scrollContainer: ElementRef;

    @ViewChild('directionsList') directionsList:ElementRef;

    @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

    public origin: any ; // its a example aleatory position
    public destination: any; // its a example aleatory position
    constructor(
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private gmapsApi: GoogleMapsAPIWrapper,
        private _elementRef: ElementRef,
        private ws: UsuarioService,
        private changeDetector : ChangeDetectorRef
    ) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();

        this.startDate = new Date(year, month, day);
    }
   
    ngOnInit() {
      
        this.objViaje = new Viaje();
        this.viajeSolicitado = false;
        // set google maps defaults
        this.zoom = 4;
        this.latitude = -34.603722;
        this.longitude = -58.381592;

        this.iconurl = '../image/map-icon.png';

        // this.mapCustomStyles = this.getMapCusotmStyles();
        // create search FormControl
        this.destinationInput = new FormControl();
        this.destinationOutput = new FormControl();
        // set current position
        //this.setCurrentPosition();
        // load Places Autocomplete
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
        
             //this.getDistanceAndDuration();
             if (this.vc.destination !== undefined ) {
                this.origenLat = this.vc.origin.latitude;
                this.origenLng = this.vc.origin.longitude;
                this.destinoLat = this.vc.destination.latitude;
                this.destinoLng = this.vc.destination.longitude;
             }
           });

        });

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
    $event.target.classList.add('active');
    console.log('active');
    this.getDistanceAndDuration();
    //this.datosObj();
    // get data for table since we are opening the div to show the body
  }

    datosObj(){
     
        let element = document.getElementById('directionsList');
        var searchThis = element.textContent || element.innerText; ///trae solo el texto

        console.log(searchThis); 
        
    }
    scrollToBottom(): void {
        jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 3000);
    }
    private setPickUpLocation( place: any ) {
        // verify result
        if (place.geometry === undefined || place.geometry === null) {
            return;
        }
        // set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
    }

    private setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          this.zoom = 12;
       });
     }
   }

   private getMapCusotmStyles() {
     // Write your Google Map Custom Style Code Here.
   }

   private validarCampos() {

   }

    pedirViaje() {
        const dateString = this.fechaViaje;
        const newDate = new Date(dateString);

        this.validarCampos();
        this.objViaje.lat_o = this.origenLat;
        this.objViaje.lng_o = this.origenLng;
        this.objViaje.lat_d = this.destinoLat;
        this.objViaje.lng_d = this.destinoLng;
        this.objViaje.tipo_pago = this.metodoPago;
        this.objViaje.fechayhora =  this.fechaViaje; // newDate;
        this.objViaje.nivel = this.nivel;
        this.objViaje.duracion = this.estimatedTime ;
        this.objViaje.distancia = this.estimatedDistance;
        this.objViaje.token = localStorage.getItem('token');

        this.ws.enviarViaje(this.objViaje,'/viaje/')
        .then( data => {
            this.viajeSolicitado = true;
            this.router.navigateByUrl('/encuesta');
       })
       .catch( e => {
           console.log(e);
       } );
   }
}
