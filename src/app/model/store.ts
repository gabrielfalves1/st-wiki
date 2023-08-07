import { GeoPoint } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

export class Store {
  _id: string = uuidv4();
  nome: string = '';
  telefone: string = '';
  foto: string = '';
  email: string = '';
  senha: string = '';
  cep: string = '';
  rua: string = '';
  numero: string = '';
  estado: string = '';
  cidade: string = '';
  coordenadas: GeoPoint | undefined;
  ativo: boolean = true;
}
