import { v4 as uuidv4 } from 'uuid';

export class Acronym {
  _id: string = uuidv4();
  name: string = '';
  desc: string = '';
}
