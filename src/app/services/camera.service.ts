import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor() {}

  async checkCameraPermission(): Promise<boolean> {
    const permission = await Camera.checkPermissions();
    return permission.camera === 'granted';
  }

  async requestCameraPermission(): Promise<boolean> {
    const permissionRequest = await Camera.requestPermissions();
    return permissionRequest.camera === 'granted';
  }
}
