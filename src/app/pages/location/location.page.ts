import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { GmapsService } from 'src/app/services/gmaps.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  constructor(
    private gmaps: GmapsService,
    private loadingCtrl: LoadingController,
    private renderer: Renderer2,
    private storage: Storage,
    private router: Router,
    private location: Location
  ) {}
  @ViewChild('map', { static: true })
  mapElementRef!: ElementRef;
  searchResults: any[] = [];
  address: string = '';
  googleMaps: any;
  directionsService: any;
  directionsDisplay: any;
  map: any;
  loading: any;
  showOptions = false;
  position: { lat: number; lng: number } = {
    lat: -22.92166588064162,
    lng: -43.19542479445832,
  };
  markers: any[] = [];
  locationExists = false;

  ngOnInit() {
    this.getLocation();
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
        cssClass: 'my-loading-class',
        spinner: 'dots',
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
        zoom: 16,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        zoomControl: false,
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

      this.addMarkersForMylocation(this.position);

      this.renderer.addClass(mapEl, 'visible');
    } catch (e) {
      console.log(e);
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

  async searchAddress(event: any) {
    if (event.target.value.length > 0) {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;

      const googleAutocomplete = new google.maps.places.AutocompleteService();

      // Defina as opções de restrição para incluir apenas cidades brasileiras
      const options = {
        input: this.address,
        componentRestrictions: { country: 'BR' }, // Código do país para o Brasil
      };

      googleAutocomplete.getPlacePredictions(options, (predictions) => {
        this.searchResults = predictions;
      });
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
        this.showOptions = true;
        this.searchResults = [];
        this.address = address;
      })
      .catch((error) => {
        console.log('Erro ao obter endereço:', error);
      });
  }

  cancel() {
    location.reload();
  }

  async confirm() {
    const coordenadas = {
      lat: this.position.lat,
      lng: this.position.lng,
    };

    await this.storage.set('coordenadas', coordenadas).then(() => {
      this.router.navigate(['/user-options']);
    });
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    let googleMaps: any = await this.gmaps.loadGoogleMaps();
    this.googleMaps = googleMaps;

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

  async getLocation() {
    const location = await this.storage.get('coordenadas');
    console.log(location);
    if (location !== null) {
      this.locationExists = true;
    }
  }

  goBack() {
    this.location.back();
  }
}
