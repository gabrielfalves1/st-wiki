import { v4 as uuidv4 } from 'uuid';

export class User {
  _id: string = uuidv4();
  nome: string = '';
  telefone: string = '';
  foto: string = '';
  email: string = '';
  senha: string = '';
  ativo: boolean = true;
  [key: string]: string | number | boolean | any;
}
