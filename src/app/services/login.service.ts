import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}
  private auth: Auth = inject(Auth);

  async login(email: string, senha: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        senha
      );
      return true;
    } catch (erro) {
      console.error(erro);
      return false;
    }
  }

  async logoff() {
    return await signOut(this.auth);
  }
}
