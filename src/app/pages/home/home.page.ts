import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GmapsService } from 'src/app/services/gmaps.service';
import { LoadingController } from '@ionic/angular';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/services/store.service';
import { GeoPoint } from '@angular/fire/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map', { static: true })
  mapElementRef!: ElementRef;
  googleMaps: any;
  position: { lat: number; lng: number } = {
    lat: -22.92166588064162,
    lng: -43.19542479445832,
  };
  address: string = '';
  polylines: any[] = [];
  map: any;
  directionsService: any;
  directionsDisplay: any;
  searchResults: any[] = [];
  mapClickListener: any;
  markerClickListener: any;
  markers: any[] = [];
  loading: any;
  stores: Store[] = [];

  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private loadingCtrl: LoadingController,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.getStores();
    this.loadMap();
  }

  getStores() {
    this.storeService.list().then((res) => {
      this.stores = <Store[]>res;
    });
  }

  async loadMap() {
    const mapStyle = [
      {
        featureType: 'poi.business',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ];

    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Carregando Mapa...',
      });
      await this.loading.present();

      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(
        this.position.lat,
        this.position.lng
      );
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 13,

        streetViewControl: false,
        fullscreenControl: false,
        styles: mapStyle,
        mapTypeControlOptions: {
          mapTypeIds: [],
        },
      });
      this.map.setOptions({
        minZoom: 5,
        maxZoom: 20,
      });
      googleMaps.event.addListener(this.map, 'zoom_changed', () => {
        if (this.map.getZoom() < 5) {
          this.map.setZoom(5);
        } else if (this.map.getZoom() > 20) {
          this.map.setZoom(20);
        }
      });

      if (this.map) {
        this.loading.dismiss();
      }

      this.directionsService = new googleMaps.DirectionsService();
      this.directionsDisplay = new googleMaps.DirectionsRenderer();

      this.addMarkersForStores();
      this.addMarkersForMylocation(this.position);

      this.renderer.addClass(mapEl, 'visible');
    } catch (e) {
      console.log(e);
    }
  }

  addMarkersForStores() {
    let googleMaps: any = this.googleMaps;

    for (const store of this.stores) {
      const geopoint: GeoPoint | undefined = store.coordenadas;

      if (geopoint) {
        const latitude = geopoint.latitude;
        const longitude = geopoint.longitude;

        const icon = {
          url: 'assets/icon/location.png',
          scaledSize: new googleMaps.Size(40, 40),
        };

        const marker = new googleMaps.Marker({
          icon: icon,
          position: new googleMaps.LatLng(latitude, longitude),
          map: this.map,
          animation: googleMaps.Animation.DROP,
        });

        marker.addListener('click', () => {
          this.removePolylines();
          this.calculateAndDisplayRoute(marker.getPosition());
        });

        this.markers.push(marker);
      }
    }
  }

  addMarkersForMylocation(position: any) {
    let googleMaps: any = this.googleMaps;
    const marker = new googleMaps.Marker({
      position: position,
      map: this.map,
      animation: googleMaps.Animation.DROP,
    });
    this.markers.push(marker);
  }

  calculateAndDisplayRoute(destination: any) {
    const directionsRequest = {
      origin: new this.googleMaps.LatLng(this.position.lat, this.position.lng),
      destination: destination,
      travelMode: 'DRIVING',
    };

    this.directionsService.route(
      directionsRequest,
      (result: { routes: any[] }, status: string) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(result);

          const route = result.routes[0];
          const polyline = new this.googleMaps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: 'green',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          this.polylines.push(polyline);

          route.legs.forEach((leg: { steps: any[] }) => {
            leg.steps.forEach((step) => {
              const path = google.maps.geometry.encoding.decodePath(
                step.polyline!.points
              );
              path.forEach((point) => {
                polyline.getPath().push(point);
              });
            });
          });

          polyline.setMap(this.map);

          const bounds = new this.googleMaps.LatLngBounds();
          route.legs.forEach((leg: { steps: any[] }) => {
            leg.steps.forEach((step) => {
              step.lat_lngs.forEach((latLng: any) => {
                bounds.extend(latLng);
              });
            });
          });
          this.map.fitBounds(bounds);
        } else {
          console.log('Falha ao obter direções:', status);
        }
      }
    );
  }

  removePolylines() {
    this.polylines.forEach((polyline) => {
      polyline.setMap(null);
    });
    this.polylines = [];
  }

  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.position.lat = position.coords.latitude;
          this.position.lng = position.coords.longitude;
          this.loadMap();
        },
        (error) => {
          console.log('Erro ao obter a localização:', error.message);
        }
      );
    } else {
      console.log('Geolocalização não é suportada neste navegador.');
    }
  }

  getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(new Error('Endereço não encontrado.'));
        }
      });
    });
  }

  searchAddress(event: any) {
    if (event.target.value.length > 0) {
      const googleAutocomplete = new google.maps.places.AutocompleteService();
      googleAutocomplete.getPlacePredictions(
        { input: this.address },
        (predictions) => {
          this.searchResults = predictions;
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  getAddress(address: string) {
    this.getCoordinates(address)
      .then((coordinates) => {
        this.position.lat = coordinates.lat;
        this.position.lng = coordinates.lng;
        this.loadMap();
        this.searchResults = [];
        this.address = address;
      })
      .catch((error) => {
        console.log('Erro ao obter endereço:', error);
      });
  }
}
