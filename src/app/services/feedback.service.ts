import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Feedback } from '../model/feedback';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor() {}
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private feedbackCollection = collection(this.firestore, 'feedbacks');

  feedback = new Feedback();

  add(feedback: Feedback, user_id: string) {
    return addDoc(collection(this.firestore, 'feedbacks'), <Feedback>{
      user_id: user_id,
      message: feedback.message,
    });
  }
}
