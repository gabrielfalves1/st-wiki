import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GmapsService } from 'src/app/services/gmaps.service';
import { IonModal, LoadingController, ModalController } from '@ionic/angular';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/services/store.service';
import { GeoPoint } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private activatedRouter: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private storeService: StoreService,
    private storage: Storage,
    private modalCtrl: ModalController
  ) { }
  @ViewChild('map', { static: true })
  mapElementRef!: ElementRef;
  googleMaps: any;
  _id: string | null = null;
  store = new Store();
  imageSrc: string | undefined;
  polylines: any[] = [];
  map: any;
  directionsService: any;
  directionsDisplay: any;
  position: { lat: number; lng: number } = {
    lat: -22.92166588064162,
    lng: -43.19542479445832,
  };
  geopoint: { lat: number; lng: number } = { lat: 0, lng: 0 };
  loading: any;
  markers: any[] = [];
  @ViewChild(IonModal) modal: IonModal | undefined;

  ngOnInit() {
    this.getParams();
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
      this.map = new googleMaps.Map(mapEl, {
        center: this.geopoint,
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
      this.addMarkerforStore(this.geopoint.lat, this.geopoint.lng);

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

  addMarkerforStore(lat: any, lng: any) {
    let googleMaps: any = this.googleMaps;

    const icon = {
      url: 'assets/icon/location.png',
      scaledSize: new googleMaps.Size(50, 50),
    };

    const marker = new googleMaps.Marker({
      icon: icon,
      position: new googleMaps.LatLng(lat, lng),
      map: this.map,
      animation: googleMaps.Animation.DROP,
    });

    const contentString = this.store.nome;
    const infoWindow = new googleMaps.InfoWindow({
      content: contentString,
    });
    infoWindow.open(this.map, marker);

    marker.addListener('click', () => {
      //this.calculateAndDisplayRoute(marker.getPosition());
      this.openModal();
    });

    this.markers.push(marker);
  }

  calculateRoute() {
    if (this.modal) this.modal.dismiss();
    this.calculateAndDisplayRoute(this.geopoint);
  }

  async getParams() {
    this._id = this.activatedRouter.snapshot.paramMap.get('id');
    if (this._id) {
      this.storeService.get(this._id).then(async (res) => {
        this.store = <Store>res;

        const geopoint: GeoPoint | undefined = this.store.coordenadas;

        if (geopoint) {
          this.geopoint.lat = geopoint.latitude;
          this.geopoint.lng = geopoint.longitude;
          this.loadMap();
        }

        if (this.store.foto) {
          await this.storeService
            .getPhotoPerfil(this.store.foto)
            .then((res) => {
              this.imageSrc = res;
            });
        } else {
          this.imageSrc = 'assets/avatar.svg';
        }
      });
    }

    await this.storage.create();
    const coords = await this.storage.get('coordenadas');

    if (coords) {
      this.position.lat = coords.lat;
      this.position.lng = coords.lng;
    }
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

  async openModal() {
    if (this.modal) this.modal.present();
  }
}
