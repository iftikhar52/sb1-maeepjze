import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase imports
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { getStorage } from '@angular/fire/storage';
import { FirebaseApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, provideAuth } from '@angular/fire/auth';
import { Firestore, provideFirestore } from '@angular/fire/firestore';
import { Storage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// Core components
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UploadComponent } from './upload/upload.component';
import { ContentListComponent } from './content/content-list/content-list.component';

// NgxDropzone for file uploads
import { NgxDropzoneModule } from 'ngx-dropzone';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    UploadComponent,
    ContentListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDropzoneModule,
    AppRoutingModule,
    RouterModule,
    RouterModule,
    // provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideStorage(() => getStorage())
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    { provide: FirebaseApp, useFactory: () => initializeApp(firebaseConfig) },
    { provide: Auth, useFactory: () => getAuth() },
    { provide: Firestore, useFactory: () => getFirestore() },
    { provide: Storage, useFactory: () => getStorage() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
