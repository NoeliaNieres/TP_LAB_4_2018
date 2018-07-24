import {GoogleMapsAPIWrapper} from '@agm/core';
import { Directive,  Input, Output } from '@angular/core';

declare var google: any;

@Directive({
  selector: 'agm-map-directions'
})
export class DirectionsMapDirective {
  @Input() origin: any ;
  @Input() destination: any;
  @Input() originPlaceId: any;
  @Input() destinationPlaceId: any;
  @Input() waypoints: any;
  @Input() directionsDisplay: any;
  @Input() estimatedTime: any;
  @Input() estimatedDistance: any;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {}

  updateDirections() {

    this.gmapsApi.getNativeMap().then(map => {
        if (!this.originPlaceId || !this.destinationPlaceId ) {
            return;
        }

        const directionsService = new google.maps.DirectionsService;
        const me = this;
        const latLngA = new google.maps.LatLng({lat: this.origin.latitude, lng: this.origin.longitude });
        const latLngB = new google.maps.LatLng({lat: this.destination.latitude, lng: this.destination.longitude });

        this.directionsDisplay.setMap(map);

        this.directionsDisplay.setOptions({
            polylineOptions: {
                    strokeWeight: 8,
                    strokeOpacity: 0.7,
                    strokeColor:  '#00468c'
                }
        });

        this.directionsDisplay.setDirections({routes: [

        ]});

        directionsService.route({
            origin: {placeId : this.originPlaceId },
            destination: {placeId : this.destinationPlaceId },
            avoidHighways: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            provideRouteAlternatives: true,
            // travelMode: 'DRIVING'
            }, function(response: any, status: any) {

                if (status === 'OK') {
                    map.setZoom(30);
                    document.getElementById('directionsList').innerHTML = null;
                    me.directionsDisplay.setDirections(response);
                    me.directionsDisplay.setPanel(document.getElementById('directionsList'));

                    const point = response.routes[ 0 ].legs[ 0 ];//primer resultado
                    me.computeTotalDistance(point);
            
                    google.maps.event.addListener(me.directionsDisplay, 'routeindex_changed', 
                    function() { 
                      //alert(me.directionsDisplay.getRouteIndex());
                      var numero = me.directionsDisplay.getRouteIndex();
                      if(numero){
                        //console.log(numero);
                        me.computeTotalDistance(response.routes[numero].legs[ 0 ]);
                      }
                    });
                          
                } else {
                  console.log('Directions request failed due to ' + status);
                }
            });
    });

  }
  
  private getcomputeDistance(latLngA: any , latLngB: any ) {
    return (google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB) / 1000).toFixed(2);
  }
  private computeTotalDistance(result) {
    this.estimatedTime = result.duration.text;
    this.estimatedDistance = result.distance.text;
    console.log('entra en compute');
    console.log('tiempo con this ' + this.estimatedTime + ' distancia ' +this.estimatedDistance  );
  }
}