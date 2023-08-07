import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AcronymsService {
  constructor() {}
  private firestore: Firestore = inject(Firestore);
  private acronymCollection = collection(this.firestore, 'acronyms');

  async list() {
    const result = await getDocs(query(this.acronymCollection));
    return result.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  }
}
