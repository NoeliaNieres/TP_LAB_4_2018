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
    private vehiculo_id: any;
    private destinoLng: any;
    private objViaje: Viaje;
    public viajeSolicitado: boolean;
    display = false;
    loader: boolean;
    public showHide:boolean = false;
    private fechaAhora: any;
    private fechaValidar: any;

    @Input() arrayAutos: Array<any>;

    @ViewChild('pickupInput') pickupInputElementRef: ElementRef;

    @ViewChild('pickupOutput') pickupOutputElementRef: ElementRef;

    @ViewChild('scrollMe')
    private scrollContainer: ElementRef;

    @ViewChild('directionsList') directionsList:ElementRef;

    @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;
    date1: Date;
    date2: Date;
    date3: Date;
    dates: Date[];
    rangeDates: Date[];
    minDate: Date;
    maxDate: Date;
    es: any;
    tr:any;
    invalidDates: Array<Date>
    tipo:string;
    fecha:string;
    ok:boolean;
    value: Date;
    error = '';
    correcto= '';
    @ViewChild('mainCaptcha') mainCaptcha: ElementRef

    public origin: any ; // its a example aleatory position
    public destination: any; // its a example aleatory position
    constructor( private router: Router, private mapsAPILoader: MapsAPILoader,
                 private ngZone: NgZone, private gmapsApi: GoogleMapsAPIWrapper,
                 private _elementRef: ElementRef, private ws: UsuarioService,
                 private changeDetector : ChangeDetectorRef) 
    {
        this.loader = true;
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();

        this.startDate = new Date(year, month, day);
    }

    ngAfterViewInit() {
        this.Captcha();
      this.mainCaptcha.nativeElement.focus()
    }
    ngOnInit() {
        setTimeout(()=>{ 
            this.loader = false;
          }, 3000);
        this.objViaje = new Viaje();
        this.viajeSolicitado = false;
        // set google maps defaults
        this.arrayAutos = new Array<any>();
        this.cargarAutos();
        this.vehiculo_id = -1;
        
        this.es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
            today: 'Hoy',
            clear: 'Borrar'
        }
        
        this.tr = {
            firstDayOfWeek : 1
        }
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month;
        let prevYear = (prevMonth === 11) ? year : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);
        
        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today,invalidDate];
    
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
    console.log(this.estimatedDistance); 
    console.log(this.estimatedTime); 
  }
  getDataForTable($event: any) {
    this.getDistanceAndDuration();
  }
    
    /*datosObj(){
     
        let element = document.getElementById('directionsList');
        var searchThis = element.textContent || element.innerText; ///trae solo el texto

        console.log(searchThis); 
        
    }*/
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
   handleSelectedValue(value) {
    // Get and value and assign it to variable declared above 
      if(value == '1')
       this.showHide = true;
   
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
    
        this.loader = false;
        this.objViaje.lat_o = this.origenLat;
        this.objViaje.lng_o = this.origenLng;
        this.objViaje.lat_d = this.destinoLat;
        this.objViaje.lng_d = this.destinoLng;
        this.objViaje.tipo_pago = this.metodoPago;
        this.objViaje.fechayhora =  this.fechaViaje; // newDate;
        this.objViaje.nivel = this.nivel;
        this.objViaje.duracion = this.estimatedTime ;
        this.objViaje.distancia = this.estimatedDistance;
        this.objViaje.vehiculo_id = this.vehiculo_id;
        this.objViaje.token = localStorage.getItem('token');
    
        this.ws.enviarViaje(this.objViaje,'/viaje/')
        .then( data => {
            this.viajeSolicitado = true;
            this.loader = true;
            this.router.navigateByUrl('/encuesta');
       })
       .catch( e => {
           console.log(e);
       } );
   }
   cargarAutos() {

    this.ws.traerObj('/vehiculo/habilitados/')
    .then( data => {
        this.arrayAutos = data;
    })
    .catch( error => {
        console.log(error);
    });
 }
 onSelect($event) {
    console.log($event);

    
}
 Captcha(){
        var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 
                '0','1','2','3','4','5','6','7','8','9');
        var i;
        for (i=0;i<6;i++){
            var a = alpha[Math.floor(Math.random() * alpha.length)];
            var b = alpha[Math.floor(Math.random() * alpha.length)];
            var c = alpha[Math.floor(Math.random() * alpha.length)];
            var d = alpha[Math.floor(Math.random() * alpha.length)];
            var e = alpha[Math.floor(Math.random() * alpha.length)];
            var f = alpha[Math.floor(Math.random() * alpha.length)];
            var g = alpha[Math.floor(Math.random() * alpha.length)];
                        }
            var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
            document.getElementById("mainCaptcha").innerHTML = code;
            (<HTMLInputElement>document.getElementById('mainCaptcha')).value = code;
            
        }
     ValidCaptcha(){
        var string1 = this.removeSpaces((<HTMLInputElement>document.getElementById('mainCaptcha')).value);
        var string2 = this.removeSpaces((<HTMLInputElement>document.getElementById('txtInput')).value);
        if (string1 == string2){
            console.log("true");
            this.correcto = "Captcha correcto!!";
            return true;
        }else{        
            console.log("false");
            this.error = "Captcha incorrecto!!";
            return false;
        }
    }
     removeSpaces(string){
        return string.split(' ').join('');
    }
}
