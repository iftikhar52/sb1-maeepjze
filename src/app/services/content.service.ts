import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  CollectionReference 
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from '@angular/fire/storage';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface VideoContent {
  id?: string;
  title: string;
  description: string;
  hashtags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: Timestamp;
  platforms: {
    tiktok: boolean;
    youtube: boolean;
    instagram: boolean;
    facebook: boolean;
  };
  publishedTo?: {
    tiktok?: { timestamp: Timestamp; success: boolean; message?: string };
    youtube?: { timestamp: Timestamp; success: boolean; message?: string };
    instagram?: { timestamp: Timestamp; success: boolean; message?: string };
    facebook?: { timestamp: Timestamp; success: boolean; message?: string };
  };
  stats?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private videosCollection: CollectionReference;
  
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.videosCollection = collection(this.firestore, 'videos');
  }

  getContentList(): Observable<VideoContent[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        
        const q = query(
          this.videosCollection,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        return from(getDocs(q)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => {
              return { id: doc.id, ...doc.data() } as VideoContent;
            });
          })
        );
      })
    );
  }

  getContent(id: string): Observable<VideoContent | null> {
    return from(getDoc(doc(this.firestore, `videos/${id}`))).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as VideoContent;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching content:', error);
        return of(null);
      })
    );
  }

  getScheduledContent(): Observable<VideoContent[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        
        const q = query(
          this.videosCollection,
          where('userId', '==', user.uid),
          where('status', '==', 'scheduled'),
          orderBy('scheduledFor', 'asc')
        );
        
        return from(getDocs(q)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => {
              return { id: doc.id, ...doc.data() } as VideoContent;
            });
          })
        );
      })
    );
  }

  getRecentPublishedContent(): Observable<VideoContent[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        
        const q = query(
          this.videosCollection,
          where('userId', '==', user.uid),
          where('status', '==', 'published'),
          orderBy('updatedAt', 'desc')
        );
        
        return from(getDocs(q)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => {
              return { id: doc.id, ...doc.data() } as VideoContent;
            }).slice(0, 5); // Get only the 5 most recent
          })
        );
      })
    );
  }

  async createContent(videoFile: File, thumbnailFile: File, contentData: Partial<VideoContent>): Promise<string> {
    try {
      const user = this.authService.user$;
      
      let userId: string | null = null;
      await user.pipe(take(1)).toPromise().then(u => {
        userId = u?.uid || null;
      });
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Upload video
      const videoStoragePath = `videos/${userId}/${Date.now()}_${videoFile.name}`;
      const videoStorageRef = ref(this.storage, videoStoragePath);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);
      
      await videoUploadTask;
      const videoUrl = await getDownloadURL(videoStorageRef);
      
      // Upload thumbnail
      const thumbnailStoragePath = `thumbnails/${userId}/${Date.now()}_${thumbnailFile.name}`;
      const thumbnailStorageRef = ref(this.storage, thumbnailStoragePath);
      const thumbnailUploadTask = uploadBytesResumable(thumbnailStorageRef, thumbnailFile);
      
      await thumbnailUploadTask;
      const thumbnailUrl = await getDownloadURL(thumbnailStorageRef);
      
      // Create content document
      const now = Timestamp.now();
      
      const newContent: VideoContent = {
        title: contentData.title || '',
        description: contentData.description || '',
        hashtags: contentData.hashtags || [],
        videoUrl,
        thumbnailUrl,
        createdAt: now,
        updatedAt: now,
        userId,
        status: contentData.status || 'draft',
        platforms: contentData.platforms || {
          tiktok: false,
          youtube: false,
          instagram: false,
          facebook: false
        },
        stats: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      };
      
      // Add scheduled date if provided
      if (contentData.scheduledFor) {
        newContent.scheduledFor = contentData.scheduledFor;
      }
      
      const docRef = await addDoc(this.videosCollection, newContent);
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async updateContent(id: string, contentData: Partial<VideoContent>, newThumbnail?: File): Promise<void> {
    try {
      const docRef = doc(this.firestore, `videos/${id}`);
      
      // If there's a new thumbnail, upload it
      if (newThumbnail) {
        const content = await getDoc(docRef);
        if (content.exists()) {
          const contentData = content.data() as VideoContent;
          
          // Delete the old thumbnail
          if (contentData.thumbnailUrl) {
            try {
              const oldThumbnailRef = ref(this.storage, contentData.thumbnailUrl);
              await deleteObject(oldThumbnailRef);
            } catch (error) {
              console.warn('Could not delete old thumbnail:', error);
            }
          }
          
          // Upload the new thumbnail
          const userId = contentData.userId;
          const thumbnailStoragePath = `thumbnails/${userId}/${Date.now()}_${newThumbnail.name}`;
          const thumbnailStorageRef = ref(this.storage, thumbnailStoragePath);
          const thumbnailUploadTask = uploadBytesResumable(thumbnailStorageRef, newThumbnail);
          
          await thumbnailUploadTask;
          contentData.thumbnailUrl = await getDownloadURL(thumbnailStorageRef);
        }
      }
      
      // Update content with the latest data
      contentData.updatedAt = Timestamp.now();
      await updateDoc(docRef, contentData);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  async deleteContent(id: string): Promise<void> {
    try {
      // Get content data first to delete associated files
      const docRef = doc(this.firestore, `videos/${id}`);
      const contentSnapshot = await getDoc(docRef);
      
      if (contentSnapshot.exists()) {
        const contentData = contentSnapshot.data() as VideoContent;
        
        // Delete video file
        if (contentData.videoUrl) {
          try {
            const videoRef = ref(this.storage, contentData.videoUrl);
            await deleteObject(videoRef);
          } catch (error) {
            console.warn('Could not delete video:', error);
          }
        }
        
        // Delete thumbnail
        if (contentData.thumbnailUrl) {
          try {
            const thumbnailRef = ref(this.storage, contentData.thumbnailUrl);
            await deleteObject(thumbnailRef);
          } catch (error) {
            console.warn('Could not delete thumbnail:', error);
          }
        }
        
        // Delete the document
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  // Method to handle scheduling a content
  async scheduleContent(id: string, scheduledDate: Date): Promise<void> {
    try {
      const docRef = doc(this.firestore, `videos/${id}`);
      await updateDoc(docRef, {
        status: 'scheduled',
        scheduledFor: Timestamp.fromDate(scheduledDate),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error scheduling content:', error);
      throw error;
    }
  }

  // Method to publish content immediately
  async publishContent(id: string, platforms: string[]): Promise<void> {
    try {
      const docRef = doc(this.firestore, `videos/${id}`);
      const now = Timestamp.now();
      
      const publishedTo: any = {};
      
      // In a real app, this would integrate with platform APIs
      // For now, we'll simulate successful publishing to all platforms
      platforms.forEach(platform => {
        publishedTo[platform] = {
          timestamp: now,
          success: true
        };
      });
      
      await updateDoc(docRef, {
        status: 'published',
        updatedAt: now,
        publishedTo
      });
    } catch (error) {
      console.error('Error publishing content:', error);
      throw error;
    }
  }
}

// Helper function for implementing `take` operator
function take<T>(count: number) {
  return function (source: Observable<T>): Observable<T> {
    let taken = 0;
    return new Observable<T>(subscriber => {
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
        error(err) { subscriber.error(err); },
        complete() { subscriber.complete(); }
      });
      return subscription;
    });
  };
}