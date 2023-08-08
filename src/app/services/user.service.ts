import { Injectable, inject } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Auth,
  updateEmail,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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
export class UserService {
  constructor(private router: Router) {}
  private auth: Auth = inject(Auth);
  private readonly storage: Storage = inject(Storage);
  private firestore: Firestore = inject(Firestore);
  private userCollection = collection(this.firestore, 'users');
  private storeCollection = collection(this.firestore, 'stores');

  user = new User();

  async add(user: User) {
    await createUserWithEmailAndPassword(this.auth, user.email, user.senha)
      .then((resAuth) => {
        return this.addUser(user, resAuth.user.uid).catch(async (err) => {
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

  addUser(user: User, idDoc: string = '') {
    return setDoc(doc(this.firestore, 'users/' + idDoc), <User>{
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      ativo: user.ativo,
    });
  }

  async setPhotoPerfil(imgName: string, imgBase64: string, id: string) {
    this.get(id).then(async (res) => {
      this.user = <User>res;
      if (this.user.foto) {
        const storageRef = ref(this.storage, this.user.foto);
        await deleteObject(storageRef);
      }
    });
    const storageRef = ref(this.storage, 'user/' + imgName);
    return await uploadString(storageRef, imgBase64, 'base64').then(
      async (res) => {
        const result = await updateDoc(doc(this.firestore, 'users', id), {
          foto: res.ref.fullPath,
        });
      }
    );
  }

  async getPhotoPerfil(imgRef: string) {
    const storage = getStorage();
    return await getDownloadURL(ref(storage, imgRef));
  }

  async updateUser(user: User, id: string) {
    const result = await updateDoc(doc(this.firestore, 'users', id), {
      nome: user.nome,
      telefone: user.telefone,
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
    const result = await updateDoc(doc(this.firestore, 'users', id), {
      email: newEmail,
    });
    return result;
  }

  async get(id: string) {
    const result = await getDoc(doc(this.firestore, 'users', id));
    return { _id: result.id, ...result.data() };
  }

  async getUserById(id: string) {
    const result = await getDoc(doc(this.firestore, 'users', id));

    if (result.exists()) {
      return true;
    } else {
      return false;
    }
  }

  async getUserIdByEmail(email: string) {
    const q = query(this.userCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      return docSnapshot.id;
    } else {
      return null;
    }
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

  async logoff() {
    return await signOut(this.auth);
  }

  async isAuthenticated() {
    const result = this.auth.currentUser;
    return result;
  }

  async userRecovery(email: string) {
    return await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('email enviado com sucesso');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
