import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../services/content.service';
import { PlatformService } from '../services/platform.service';

@Component({
  selector: 'app-upload',
  template: `
    <div class="upload-container">
      <div class="upload-header">
        <h1>Upload New Content</h1>
        <p class="subtitle">Upload once, publish across all platforms</p>
      </div>
      
      <!-- <div class="upload-content">
        <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" *ngIf="!isUploading">
          <div class="upload-section">
            <h2>1. Upload Video</h2>
            
            <div class="video-upload-area" 
              ngxDropzone 
              [accept]="'video/*'"
              (change)="onVideoSelect($event)"
              [multiple]="false"
              [maxFileSize]="maxFileSize"
            >
              <ngx-dropzone-label *ngIf="!selectedVideo">
                <div class="upload-placeholder">
                  <i class="material-icons">videocam</i>
                  <p>Drag and drop your video or click to browse</p>
                  <p class="upload-hint">MP4, MOV or WebM. Max size: 100MB.</p>
                </div>
              </ngx-dropzone-label>
              
              <div class="selected-video" *ngIf="selectedVideo">
                <video controls *ngIf="videoPreviewUrl">
                  <source [src]="videoPreviewUrl" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <div class="video-info">
                  <span>{{ selectedVideo.name }}</span>
                  <span>{{ formatFileSize(selectedVideo.size) }}</span>
                  <button type="button" class="btn btn-text" (click)="removeVideo()">
                    <i class="material-icons">delete</i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="upload-section">
            <h2>2. Add Thumbnail</h2>
            
            <div class="thumbnail-upload-area"
              ngxDropzone
              [accept]="'image/*'"
              (change)="onThumbnailSelect($event)"
              [multiple]="false"
              [maxFileSize]="maxThumbnailSize"
            >
              <ngx-dropzone-label *ngIf="!selectedThumbnail">
                <div class="upload-placeholder">
                  <i class="material-icons">image</i>
                  <p>Drag and drop your thumbnail or click to browse</p>
                  <p class="upload-hint">JPG, PNG or GIF. Recommended: 9:16 ratio.</p>
                </div>
              </ngx-dropzone-label>
              
              <div class="selected-thumbnail" *ngIf="selectedThumbnail">
                <img [src]="thumbnailPreviewUrl" alt="Thumbnail preview">
                <div class="thumbnail-info">
                  <span>{{ selectedThumbnail.name }}</span>
                  <span>{{ formatFileSize(selectedThumbnail.size) }}</span>
                  <button type="button" class="btn btn-text" (click)="removeThumbnail()">
                    <i class="material-icons">delete</i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="upload-section">
            <h2>3. Content Details</h2>
            
            <div class="form-group">
              <label for="title" class="form-label">Title *</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title" 
                class="form-control" 
                placeholder="Enter a catchy title"
              >
              <small *ngIf="uploadForm.get('title')?.invalid && uploadForm.get('title')?.touched" class="text-error">
                Title is required (max 100 characters)
              </small>
            </div>
            
            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="form-control" 
                rows="4" 
                placeholder="Add a description of your video"
              ></textarea>
              <small *ngIf="uploadForm.get('description')?.invalid && uploadForm.get('description')?.touched" class="text-error">
                Description cannot exceed 500 characters
              </small>
            </div>
            
            <div class="form-group">
              <label for="hashtags" class="form-label">Hashtags</label>
              <input 
                type="text" 
                id="hashtags" 
                formControlName="hashtags" 
                class="form-control" 
                placeholder="Add hashtags separated by commas (e.g., #trending, #viral)"
              >
              <small class="form-hint">Add up to 10 hashtags to help viewers discover your content</small>
            </div>
          </div>
          
          <div class="upload-section">
            <h2>4. Publishing Options</h2>
            
            <div class="platform-selection">
              <label class="form-label">Select Platforms to Publish *</label>
              
              <div class="platforms-grid">
                <div class="platform-checkbox">
                  <input type="checkbox" id="tiktok" formControlName="tiktok">
                  <label for="tiktok" class="platform-label platform-tiktok">
                    <span class="platform-icon">TT</span>
                    <span class="platform-name">TikTok</span>
                  </label>
                </div>
                
                <div class="platform-checkbox">
                  <input type="checkbox" id="youtube" formControlName="youtube">
                  <label for="youtube" class="platform-label platform-youtube">
                    <span class="platform-icon">YT</span>
                    <span class="platform-name">YouTube Shorts</span>
                  </label>
                </div>
                
                <div class="platform-checkbox">
                  <input type="checkbox" id="instagram" formControlName="instagram">
                  <label for="instagram" class="platform-label platform-instagram">
                    <span class="platform-icon">IG</span>
                    <span class="platform-name">Instagram Reels</span>
                  </label>
                </div>
                
                <div class="platform-checkbox">
                  <input type="checkbox" id="facebook" formControlName="facebook">
                  <label for="facebook" class="platform-label platform-facebook">
                    <span class="platform-icon">FB</span>
                    <span class="platform-name">Facebook Reels</span>
                  </label>
                </div>
              </div>
              
              <small *ngIf="!isPlatformSelected && isFormSubmitted" class="text-error">
                Please select at least one platform
              </small>
            </div>
            
            <div class="publish-options">
              <div class="form-group">
                <label class="form-label">When to Publish</label>
                
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" id="publish-now" formControlName="publishType" value="now">
                    <label for="publish-now">Publish Now</label>
                  </div>
                  
                  <div class="radio-option">
                    <input type="radio" id="publish-schedule" formControlName="publishType" value="schedule">
                    <label for="publish-schedule">Schedule for Later</label>
                  </div>
                </div>
              </div>
              
              <div class="form-group" *ngIf="uploadForm.get('publishType')?.value === 'schedule'">
                <label for="scheduleDate" class="form-label">Schedule Date & Time</label>
                <input 
                  type="datetime-local" 
                  id="scheduleDate" 
                  formControlName="scheduleDate" 
                  class="form-control"
                >
                <small *ngIf="uploadForm.get('scheduleDate')?.invalid && uploadForm.get('scheduleDate')?.touched" class="text-error">
                  Please select a valid future date and time
                </small>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="onCancel()">Cancel</button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!selectedVideo || !selectedThumbnail"
            >
              {{ uploadForm.get('publishType')?.value === 'schedule' ? 'Schedule Content' : 'Publish Now' }}
            </button>
          </div>
        </form>
        
        <div class="upload-progress" *ngIf="isUploading">
          <div class="progress-indicator">
            <div class="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke-width="8" stroke="#e0e0e0"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke-width="8" stroke="#6200ea"
                  stroke-dasharray="283"
                  [attr.stroke-dashoffset]="283 - (283 * uploadProgress) / 100"
                  stroke-linecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div class="progress-text">{{ uploadProgress }}%</div>
            </div>
          </div>
          <h2>Uploading Content</h2>
          <p>Please don't close this window while your content is being uploaded...</p>
        </div>
      </div> -->
    </div>
  `,
  styles: [
    `
    .upload-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .upload-header {
      margin-bottom: var(--space-4);
    }
    
    .subtitle {
      color: var(--text-secondary);
    }
    
    .upload-content {
      background-color: var(--surface);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      padding: var(--space-4);
    }
    
    .upload-section {
      margin-bottom: var(--space-5);
    }
    
    .upload-section h2 {
      font-size: 1.25rem;
      margin-bottom: var(--space-3);
      display: flex;
      align-items: center;
    }
    
    .upload-section h2:before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background-color: var(--primary);
      margin-right: var(--space-2);
      border-radius: 2px;
    }
    
    .video-upload-area, .thumbnail-upload-area {
      height: 240px;
      background-color: var(--background);
      border: 2px dashed var(--divider);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
    }
    
    .video-upload-area:hover, .thumbnail-upload-area:hover {
      border-color: var(--primary);
      background-color: rgba(98, 0, 234, 0.05);
    }
    
    .upload-placeholder {
      text-align: center;
      padding: var(--space-4);
    }
    
    .upload-placeholder i {
      font-size: 48px;
      color: var(--text-hint);
      margin-bottom: var(--space-2);
    }
    
    .upload-hint {
      font-size: 0.8rem;
      color: var(--text-hint);
      margin-top: var(--space-1);
    }
    
    .selected-video, .selected-thumbnail {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-2);
    }
    
    .selected-video video {
      max-height: 70%;
      max-width: 100%;
      margin-bottom: var(--space-2);
    }
    
    .selected-thumbnail img {
      max-height: 70%;
      max-width: 100%;
      border-radius: 4px;
      margin-bottom: var(--space-2);
    }
    
    .video-info, .thumbnail-info {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .btn-text {
      background: none;
      border: none;
      color: var(--error);
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
    }
    
    .btn-text i {
      font-size: 16px;
      margin-right: var(--space-1);
    }
    
    .btn-text:hover {
      background-color: rgba(244, 67, 54, 0.1);
    }
    
    .platform-selection {
      margin-bottom: var(--space-4);
    }
    
    .platforms-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
      margin-top: var(--space-2);
    }
    
    .platform-checkbox {
      position: relative;
    }
    
    .platform-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }
    
    .platform-label {
      display: flex;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--divider);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .platform-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--space-2);
      font-weight: 600;
      color: white;
    }
    
    .platform-tiktok .platform-icon {
      background-color: var(--platform-bg);
    }
    
    .platform-youtube .platform-icon {
      background-color: var(--platform-bg);
    }
    
    .platform-instagram .platform-icon {
      background: var(--platform-bg);
    }
    
    .platform-facebook .platform-icon {
      background-color: var(--platform-bg);
    }
    
    .platform-checkbox input:checked + .platform-label {
      border-color: var(--primary);
      background-color: rgba(98, 0, 234, 0.05);
    }
    
    .radio-group {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }
    
    .radio-option {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .form-hint {
      font-size: 0.8rem;
      color: var(--text-hint);
      margin-top: var(--space-1);
    }
    
    .text-error {
      color: var(--error);
      font-size: 0.85rem;
      display: block;
      margin-top: var(--space-1);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-5);
    }
    
    .upload-progress {
      text-align: center;
      padding: var(--space-6) 0;
    }
    
    .progress-indicator {
      margin-bottom: var(--space-4);
    }
    
    .progress-circle {
      width: 120px;
      height: 120px;
      position: relative;
      margin: 0 auto;
    }
    
    .progress-circle svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .platforms-grid {
        grid-template-columns: 1fr;
      }
      
      .radio-group {
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions .btn {
        width: 100%;
      }
    }
  `,
  ],
})
export class UploadComponent {
  uploadForm: FormGroup;
  selectedVideo: File | null = null;
  selectedThumbnail: File | null = null;
  videoPreviewUrl: string | null = null;
  thumbnailPreviewUrl: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  isFormSubmitted = false;
  maxFileSize = 104857600; // 100MB
  maxThumbnailSize = 5242880; // 5MB

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private platformService: PlatformService,
    private router: Router
  ) {
    // Initialize with tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      hashtags: [''],
      tiktok: [true],
      youtube: [true],
      instagram: [true],
      facebook: [true],
      publishType: ['now'],
      scheduleDate: [
        this.formatDateForInput(tomorrow),
        [this.futureDateValidator],
      ],
    });
  }

  get isPlatformSelected(): boolean {
    return (
      this.uploadForm.get('tiktok')?.value ||
      this.uploadForm.get('youtube')?.value ||
      this.uploadForm.get('instagram')?.value ||
      this.uploadForm.get('facebook')?.value
    );
  }

  onVideoSelect(event: any): void {
    const files = event.addedFiles;
    if (files.length > 0) {
      this.selectedVideo = files[0];

      // Create preview URL
      if (this.videoPreviewUrl) {
        URL.revokeObjectURL(this.videoPreviewUrl);
      }
      // this.videoPreviewUrl = URL.createObjectURL(this.selectedVideo);
      this.videoPreviewUrl = this.selectedVideo
        ? URL.createObjectURL(this.selectedVideo)
        : null;
    }
  }

  onThumbnailSelect(event: any): void {
    const files = event.addedFiles;
    if (files.length > 0) {
      this.selectedThumbnail = files[0];

      // Create preview URL
      if (this.thumbnailPreviewUrl) {
        URL.revokeObjectURL(this.thumbnailPreviewUrl);
      }
      if (this.selectedThumbnail) {
        this.thumbnailPreviewUrl = URL.createObjectURL(this.selectedThumbnail);
      }
    }
  }

  removeVideo(): void {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
    }
    this.selectedVideo = null;
    this.videoPreviewUrl = null;
  }

  removeThumbnail(): void {
    if (this.thumbnailPreviewUrl) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl);
    }
    this.selectedThumbnail = null;
    this.thumbnailPreviewUrl = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDateForInput(date: Date): string {
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    const scheduledDate = new Date(control.value);
    const now = new Date();

    if (scheduledDate <= now) {
      return { pastDate: true };
    }
    return null;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (!this.selectedVideo || !this.selectedThumbnail) {
      return;
    }

    if (!this.isPlatformSelected) {
      return;
    }

    if (this.uploadForm.invalid) {
      Object.keys(this.uploadForm.controls).forEach((key) => {
        const control = this.uploadForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    // Start upload process
    this.isUploading = true;

    // Simulate upload progress (in a real app, this would come from the Firebase upload)
    const progressInterval = setInterval(() => {
      this.uploadProgress += 5;
      if (this.uploadProgress >= 100) {
        clearInterval(progressInterval);

        // Process the form data and upload
        this.processUpload();
      }
    }, 200);
  }

  processUpload(): void {
    const formValues = this.uploadForm.value;

    // Parse hashtags from comma-separated string
    const hashtags = formValues.hashtags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    // Build platforms object
    const platforms = {
      tiktok: formValues.tiktok,
      youtube: formValues.youtube,
      instagram: formValues.instagram,
      facebook: formValues.facebook,
    };

    // Determine if this is scheduled or immediate
    const isScheduled = formValues.publishType === 'schedule';
    const status = isScheduled ? 'scheduled' : 'draft';

    // Prepare content data
    const contentData = {
      title: formValues.title,
      description: formValues.description,
      hashtags,
      platforms,
      status,
    };

    // Add scheduled date if applicable
    if (isScheduled) {
      //------------------------------uncommit this------------------///
      // contentData.scheduledFor = new Date(formValues.scheduleDate);
    }

    // In a real app, this would upload to Firebase
    // For now, we'll just redirect to the dashboard after a delay
    setTimeout(() => {
      // Here we would call the contentService.createContent() method
      // contentService.createContent(this.selectedVideo, this.selectedThumbnail, contentData)

      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
