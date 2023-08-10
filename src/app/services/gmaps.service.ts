import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class GmapsService {
  constructor() {}

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.apiMapsKey +
        '&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    const apiKey = environment.apiMapsKey;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted_address || null;
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return null;
    }
  }

  async getCityFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    const apiKey = environment.apiMapsKey;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const stateComponent = addressComponents.find((comp: any) =>
            comp.types.includes('administrative_area_level_1')
          );
          return stateComponent ? stateComponent.short_name : null;
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter sigla do estado:', error);
      return null;
    }
  }

  async getStates(): Promise<string[]> {
    try {
      const response = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      if (response.ok) {
        const statesData = await response.json();

        const states = statesData.map((state: any) => state.sigla);
        return states;
      } else {
        console.error(
          'Erro ao obter estados brasileiros:',
          response.statusText
        );
        return [];
      }
    } catch (error) {
      console.error('Erro ao obter estados brasileiros:', error);
      return [];
    }
  }
}
