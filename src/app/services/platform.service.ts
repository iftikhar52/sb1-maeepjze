import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface PlatformConnection {
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Timestamp;
  username?: string;
  profileImage?: string;
  lastSync?: Timestamp;
}

export interface PlatformStatus {
  tiktok: PlatformConnection;
  youtube: PlatformConnection;
  instagram: PlatformConnection;
  facebook: PlatformConnection;
}

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getPlatformStatus(): Observable<PlatformStatus | null> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }

        return from(getDoc(doc(this.firestore, `users/${user.uid}`))).pipe(
          map((doc) => {
            if (doc.exists()) {
              const data = doc.data();
              return data['platforms'] as PlatformStatus;
            }
            return null;
          }),
          catchError((error) => {
            console.error('Error fetching platform status:', error);
            return of(null);
          })
        );
      })
    );
  }

  async connectPlatform(
    platform: string,
    connectionData: Partial<PlatformConnection>
  ): Promise<void> {
    try {
      const user = await this.authService.user$.pipe(take(1)).toPromise();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const userRef = doc(this.firestore, `users/${user.uid}`);

      // Update just the specific platform
      await updateDoc(userRef, {
        [`platforms.${platform}`]: {
          connected: true,
          lastSync: Timestamp.now(),
          ...connectionData,
        },
      });
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      throw error;
    }
  }

  async disconnectPlatform(platform: string): Promise<void> {
    try {
      const user = await this.authService.user$.pipe(take(1)).toPromise();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const userRef = doc(this.firestore, `users/${user.uid}`);

      // Reset the platform connection
      await updateDoc(userRef, {
        [`platforms.${platform}`]: {
          connected: false,
        },
      });
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      throw error;
    }
  }

  // In a real app, this would authenticate with the actual platform APIs
  // For now, we'll simulate authentication with a mock implementation
  async authenticatePlatform(platform: string): Promise<PlatformConnection> {
    // Simulate API authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful authentication
        resolve({
          connected: true,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          tokenExpiry: Timestamp.fromDate(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ), // 30 days
          username: `user_${platform}`,
          profileImage: `https://picsum.photos/100/100?random=${Math.floor(
            Math.random() * 1000
          )}`,
          lastSync: Timestamp.now(),
        });
      }, 1500); // Simulate API call delay
    });
  }
}

// Helper function for implementing `take` operator
function take<T>(count: number) {
  return function (source: Observable<T>): Observable<T> {
    let taken = 0;
    return new Observable<T>((subscriber) => {
      const subscription = source.subscribe({
        next(value) {
          if (taken < count) {
            taken++;
            subscriber.next(value);
            if (taken === count) {
              subscriber.complete();
            }
          }
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });
      return subscription;
    });
  };
}
