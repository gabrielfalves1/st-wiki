import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Store } from '../model/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }
  
  private repository = 'lojas';
  private firestore: Firestore = inject(Firestore);
  private collection = collection(this.firestore, this.repository);


async list() {
  const result = await getDocs(query(this.collection));
  return result.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
}




}
