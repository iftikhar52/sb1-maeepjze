import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.user$ = new Observable<User | null>((observer) => {
      return this.auth.onAuthStateChanged(observer);
    });
  }

  async register(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update the user's display name
      if (this.auth.currentUser) {
        await updateProfile(this.auth.currentUser, { displayName });
      }
      
      // Create a user document in Firestore
      await this.createUserDocument(credential.user, { displayName });
      
      return credential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  private async createUserDocument(user: User, additionalData?: any): Promise<void> {
    // Reference to the user document
    const userRef = doc(this.firestore, `users/${user.uid}`);
    
    // Get the current data
    const snapshot = await getDoc(userRef);
    
    // Only create the document if it doesn't exist
    if (!snapshot.exists()) {
      const { email, displayName, photoURL, uid } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          uid,
          email,
          displayName: displayName || additionalData?.displayName || '',
          photoURL: photoURL || '',
          createdAt,
          platforms: {
            tiktok: { connected: false },
            youtube: { connected: false },
            instagram: { connected: false },
            facebook: { connected: false }
          },
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    }
  }
}