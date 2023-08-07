import { v4 as uuidv4 } from 'uuid';

export class Feedback {
  _id: string = uuidv4();
  user_id: string = '';
  message: string = '';
}
