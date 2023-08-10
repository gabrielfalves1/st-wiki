import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Store } from '../model/store';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  updateEmail,
} from '@angular/fire/auth';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {}

  private repository = 'stores';
  private firestore: Firestore = inject(Firestore);
  private collection = collection(this.firestore, this.repository);
  private storeCollection = collection(this.firestore, 'stores');
  private userCollection = collection(this.firestore, 'users');
  private auth: Auth = inject(Auth);
  private readonly storage: Storage = inject(Storage);
  store = new Store();

  async add(store: Store) {
    await createUserWithEmailAndPassword(this.auth, store.email, store.senha)
      .then((resAuth) => {
        return this.addStore(store, resAuth.user.uid).catch(async (err) => {
          await this.auth.currentUser?.delete();
        });
      })
      .catch(async (erroAuth) => {
        await this.auth.currentUser?.delete();
      })
      .finally(() => {
        this.logoff();
      });
  }

  addStore(store: Store, idDoc: string = '') {
    return setDoc(doc(this.firestore, 'stores/' + idDoc), <Store>{
      nome: store.nome,
      email: store.email,
      telefone: store.telefone,
      cep: store.cep,
      rua: store.rua,
      numero: store.numero,
      cidade: store.cidade,
      estado: store.estado,
      coordenadas: store.coordenadas,
      ativo: store.ativo,
    });
  }

  async list(state: string) {
    const result = await getDocs(
      query(
        this.storeCollection,
        where('ativo', '==', true),
        where('estado', '==', state)
      )
    );
    return result.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  }

  async searchEmail(email: string) {
    const resultUser = await getDocs(
      query(this.userCollection, where('email', '==', email))
    );

    const resultStore = await getDocs(
      query(this.storeCollection, where('email', '==', email))
    );

    if (resultUser.docs.length > 0) {
      return true;
    } else if (resultStore.docs.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getStoreById(id: string) {
    const result = await getDoc(doc(this.firestore, 'stores', id));

    if (result.exists()) {
      return true;
    } else {
      return false;
    }
  }

  async get(id: string) {
    const result = await getDoc(doc(this.firestore, 'stores', id));
    return { _id: result.id, ...result.data() };
  }

  async getStoreIdByEmail(email: string) {
    const q = query(this.storeCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      return docSnapshot.id;
    } else {
      return null;
    }
  }

  async setPhotoPerfil(imgName: string, imgBase64: string, id: string) {
    this.get(id).then(async (res) => {
      this.store = <Store>res;
      if (this.store.foto) {
        const storageRef = ref(this.storage, this.store.foto);
        await deleteObject(storageRef);
      }
    });
    const storageRef = ref(this.storage, 'store/' + imgName);
    return await uploadString(storageRef, imgBase64, 'base64').then(
      async (res) => {
        const result = await updateDoc(doc(this.firestore, 'stores', id), {
          foto: res.ref.fullPath,
        });
      }
    );
  }

  async getPhotoPerfil(imgRef: string) {
    const storage = getStorage();
    return await getDownloadURL(ref(storage, imgRef));
  }

  async updateStore(store: Store, id: string) {
    const result = await updateDoc(doc(this.firestore, 'stores', id), {
      nome: store.nome,
      telefone: store.telefone,
    });
    return result;
  }

  async updateAddress(store: Store, id: string) {
    const result = await updateDoc(doc(this.firestore, 'stores', id), {
      cep: store.cep,
      rua: store.rua,
      numero: store.numero,
      cidade: store.cidade,
      estado: store.estado,
      coordenadas: store.coordenadas,
    });
    return result;
  }

  async updateAuthEmail(newEmail: string) {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, newEmail).then(() => {
          if (user.email) {
            this.updateEmail(user.email, user.uid);
          } else {
            console.error('O usuário não possui um e-mail válido.');
          }
        });
        return true;
      } catch (error) {
        console.error('Erro ao atualizar o email:', error);
        return false;
      }
    } else {
      return false;
    }
  }

  async updateEmail(newEmail: string, id: string) {
    const result = await updateDoc(doc(this.firestore, 'stores', id), {
      email: newEmail,
    });
    return result;
  }

  async logoff() {
    return await signOut(this.auth);
  }
}
