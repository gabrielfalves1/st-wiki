import { GeoPoint } from "@angular/fire/firestore";
export class Store {
    _id: string | undefined
    nome: string | undefined 
    coordenadas: GeoPoint | undefined;
}
