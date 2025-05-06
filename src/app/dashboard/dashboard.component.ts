import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ContentService, VideoContent } from '../services/content.service';
import { PlatformService, PlatformStatus } from '../services/platform.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="dashboard-actions">
          <button class="btn btn-primary" (click)="navigateToUpload()">
            <i class="material-icons">add</i> New Upload
          </button>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="stats-container slide-up">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">videocam</i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ contentCount }}</span>
            <span class="stat-label">Videos</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">schedule</i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ scheduledCount }}</span>
            <span class="stat-label">Scheduled</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">publish</i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ publishedCount }}</span>
            <span class="stat-label">Published</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">devices</i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ connectedPlatformsCount }}/4</span>
            <span class="stat-label">Platforms</span>
          </div>
        </div>
      </div>
      
      <!-- Platform Connection Status -->
      <div class="dashboard-section slide-up">
        <div class="section-header">
          <h2>Platform Connections</h2>
          <a [routerLink]="['/platforms']" class="section-link">Manage Connections</a>
        </div>
        
        <div class="platforms-container" *ngIf="platformStatus">
          <div 
            class="platform-card" 
            [ngClass]="{'connected': platformStatus?.tiktok?.connected}"
            (click)="navigateToPlatforms()"
          >
            <div class="platform-logo">
              <div class="logo-placeholder platform-tiktok">TT</div>
            </div>
            <div class="platform-info">
              <div class="platform-name">TikTok</div>
              <div class="platform-status">
                {{ platformStatus?.tiktok?.connected ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            <div class="platform-action">
              <i class="material-icons">{{ platformStatus?.tiktok?.connected ? 'check_circle' : 'add_circle' }}</i>
            </div>
          </div>
          
          <div 
            class="platform-card" 
            [ngClass]="{'connected': platformStatus?.youtube?.connected}"
            (click)="navigateToPlatforms()"
          >
            <div class="platform-logo">
              <div class="logo-placeholder platform-youtube">YT</div>
            </div>
            <div class="platform-info">
              <div class="platform-name">YouTube</div>
              <div class="platform-status">
                {{ platformStatus?.youtube?.connected ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            <div class="platform-action">
              <i class="material-icons">{{ platformStatus?.youtube?.connected ? 'check_circle' : 'add_circle' }}</i>
            </div>
          </div>
          
          <div 
            class="platform-card" 
            [ngClass]="{'connected': platformStatus?.instagram?.connected}"
            (click)="navigateToPlatforms()"
          >
            <div class="platform-logo">
              <div class="logo-placeholder platform-instagram">IG</div>
            </div>
            <div class="platform-info">
              <div class="platform-name">Instagram</div>
              <div class="platform-status">
                {{ platformStatus?.instagram?.connected ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            <div class="platform-action">
              <i class="material-icons">{{ platformStatus?.instagram?.connected ? 'check_circle' : 'add_circle' }}</i>
            </div>
          </div>
          
          <div 
            class="platform-card" 
            [ngClass]="{'connected': platformStatus?.facebook?.connected}"
            (click)="navigateToPlatforms()"
          >
            <div class="platform-logo">
              <div class="logo-placeholder platform-facebook">FB</div>
            </div>
            <div class="platform-info">
              <div class="platform-name">Facebook</div>
              <div class="platform-status">
                {{ platformStatus?.facebook?.connected ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            <div class="platform-action">
              <i class="material-icons">{{ platformStatus?.facebook?.connected ? 'check_circle' : 'add_circle' }}</i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scheduled Content -->
      <div class="dashboard-section slide-up">
        <div class="section-header">
          <h2>Upcoming Schedule</h2>
          <a [routerLink]="['/schedule']" class="section-link">View All</a>
        </div>
        
        <div class="scheduled-content" *ngIf="scheduledContent.length > 0; else noScheduled">
          <div class="scheduled-item" *ngFor="let item of scheduledContent">
            <div class="scheduled-thumbnail">
              <img [src]="item.thumbnailUrl" alt="{{ item.title }}">
              <div class="scheduled-time">
                {{ formatScheduleDate(item.scheduledFor) }}
              </div>
            </div>
            <div class="scheduled-details">
              <div class="scheduled-title">{{ item.title }}</div>
              <div class="scheduled-platforms">
                <span class="platform-badge platform-tiktok" *ngIf="item.platforms.tiktok">TikTok</span>
                <span class="platform-badge platform-youtube" *ngIf="item.platforms.youtube">YouTube</span>
                <span class="platform-badge platform-instagram" *ngIf="item.platforms.instagram">Instagram</span>
                <span class="platform-badge platform-facebook" *ngIf="item.platforms.facebook">Facebook</span>
              </div>
            </div>
            <div class="scheduled-actions">
              <button class="btn btn-outline btn-sm" (click)="navigateToEdit(item.id)">Edit</button>
            </div>
          </div>
        </div>
        
        <ng-template #noScheduled>
          <div class="empty-state">
            <div class="empty-icon">
              <i class="material-icons">event_busy</i>
            </div>
            <div class="empty-text">No scheduled content yet</div>
            <button class="btn btn-primary" (click)="navigateToUpload()">Create New Content</button>
          </div>
        </ng-template>
      </div>
      
      <!-- Recent Activity -->
      <div class="dashboard-section slide-up">
        <div class="section-header">
          <h2>Recent Publications</h2>
          <a [routerLink]="['/content']" class="section-link">View All Content</a>
        </div>
        
        <div class="recent-content" *ngIf="recentContent.length > 0; else noRecent">
          <div class="recent-item" *ngFor="let item of recentContent">
            <div class="recent-thumbnail">
              <img [src]="item.thumbnailUrl" alt="{{ item.title }}">
            </div>
            <div class="recent-details">
              <div class="recent-title">{{ item.title }}</div>
              <div class="recent-platforms">
                <span 
                  class="platform-badge" 
                  *ngFor="let platform of getPublishedPlatforms(item)"
                  [ngClass]="'platform-' + platform"
                >
                  {{ getPlatformName(platform) }}
                </span>
              </div>
            </div>
            <div class="recent-stats">
              <div class="stat-item">
                <i class="material-icons">visibility</i>
                <span>{{ item.stats?.views || 0 }}</span>
              </div>
              <div class="stat-item">
                <i class="material-icons">thumb_up</i>
                <span>{{ item.stats?.likes || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #noRecent>
          <div class="empty-state">
            <div class="empty-icon">
              <i class="material-icons">video_library</i>
            </div>
            <div class="empty-text">No published content yet</div>
            <button class="btn btn-primary" (click)="navigateToUpload()">Create New Content</button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .dashboard-actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .dashboard-actions .btn i {
      margin-right: var(--space-1);
      font-size: 18px;
      vertical-align: text-bottom;
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }
    
    .stat-card {
      background-color: var(--surface);
      border-radius: 8px;
      padding: var(--space-3);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background-color: rgba(98, 0, 234, 0.1);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--space-3);
    }
    
    .stat-icon i {
      font-size: 24px;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.2;
    }
    
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .dashboard-section {
      background-color: var(--surface);
      border-radius: 8px;
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .section-header h2 {
      margin-bottom: 0;
      font-size: 1.25rem;
    }
    
    .section-link {
      color: var(--primary);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
    }
    
    .platforms-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-3);
    }
    
    .platform-card {
      border: 1px solid var(--divider);
      border-radius: 8px;
      padding: var(--space-3);
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .platform-card:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .platform-card.connected {
      border-color: var(--primary);
      background-color: rgba(98, 0, 234, 0.05);
    }
    
    .logo-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .platform-info {
      margin-left: var(--space-2);
      flex: 1;
    }
    
    .platform-name {
      font-weight: 500;
    }
    
    .platform-status {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .platform-action i {
      color: var(--primary);
    }
    
    .scheduled-content, .recent-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .scheduled-item, .recent-item {
      display: flex;
      align-items: center;
      padding: var(--space-2);
      border-radius: 8px;
      transition: background-color 0.2s ease;
      border: 1px solid var(--divider);
    }
    
    .scheduled-item:hover, .recent-item:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    .scheduled-thumbnail, .recent-thumbnail {
      position: relative;
      width: 80px;
      height: 144px;
      overflow: hidden;
      border-radius: 4px;
      margin-right: var(--space-3);
    }
    
    .scheduled-thumbnail img, .recent-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .scheduled-time {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: var(--space-1);
      font-size: 0.75rem;
      text-align: center;
    }
    
    .scheduled-details, .recent-details {
      flex: 1;
    }
    
    .scheduled-title, .recent-title {
      font-weight: 500;
      margin-bottom: var(--space-1);
    }
    
    .scheduled-platforms, .recent-platforms {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }
    
    .recent-stats {
      display: flex;
      gap: var(--space-3);
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
    }
    
    .stat-item i {
      font-size: 16px;
      margin-right: var(--space-1);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-4) 0;
    }
    
    .empty-icon {
      margin-bottom: var(--space-2);
    }
    
    .empty-icon i {
      font-size: 48px;
      color: var(--text-hint);
    }
    
    .empty-text {
      color: var(--text-secondary);
      margin-bottom: var(--space-3);
    }
    
    .btn-sm {
      padding: var(--space-1) var(--space-2);
      font-size: 0.875rem;
      min-height: 32px;
    }
    
    @media (max-width: 992px) {
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .platforms-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 576px) {
      .stats-container {
        grid-template-columns: 1fr;
      }
      
      .platforms-container {
        grid-template-columns: 1fr;
      }
      
      .scheduled-item, .recent-item {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .scheduled-thumbnail, .recent-thumbnail {
        width: 100%;
        height: 200px;
        margin-right: 0;
        margin-bottom: var(--space-2);
      }
      
      .scheduled-actions, .recent-stats {
        margin-top: var(--space-2);
        width: 100%;
      }
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  contentList: VideoContent[] = [];
  scheduledContent: VideoContent[] = [];
  recentContent: VideoContent[] = [];
  platformStatus: PlatformStatus | null = null;

  contentCount = 0;
  scheduledCount = 0;
  publishedCount = 0;
  connectedPlatformsCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private contentService: ContentService,
    private platformService: PlatformService
  ) {}

  ngOnInit(): void {
    this.loadContentData();
    this.loadPlatformStatus();
  }

  loadContentData(): void {
    // Get all content
    this.contentService.getContentList().subscribe((content) => {
      this.contentList = content;
      this.contentCount = content.length;

      // Count by status
      this.scheduledCount = content.filter(
        (item) => item.status === 'scheduled'
      ).length;
      this.publishedCount = content.filter(
        (item) => item.status === 'published'
      ).length;
    });

    // Get scheduled content
    this.contentService.getScheduledContent().subscribe((content) => {
      this.scheduledContent = content.slice(0, 3); // Only get top 3
    });

    // Get recent published content
    this.contentService.getRecentPublishedContent().subscribe((content) => {
      this.recentContent = content;
    });
  }

  loadPlatformStatus(): void {
    this.platformService.getPlatformStatus().subscribe((status) => {
      this.platformStatus = status;

      if (status) {
        this.connectedPlatformsCount =
          (status.tiktok.connected ? 1 : 0) +
          (status.youtube.connected ? 1 : 0) +
          (status.instagram.connected ? 1 : 0) +
          (status.facebook.connected ? 1 : 0);
      }
    });
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }

  navigateToEdit(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/content', id]);
    }
  }

  navigateToPlatforms(): void {
    this.router.navigate(['/platforms']);
  }

  formatScheduleDate(timestamp: any): string {
    if (!timestamp) return '';

    const date = timestamp.toDate();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${this.formatTime(date)}`;
    }

    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${this.formatTime(date)}`;
    }

    // Otherwise, return date and time
    return `${date.toLocaleDateString()} at ${this.formatTime(date)}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getPublishedPlatforms(item: VideoContent): string[] {
    if (!item.publishedTo) return [];

    return Object.keys(item.publishedTo).filter((platform) => {
      return item.publishedTo?.[platform as keyof typeof item.publishedTo]
        ?.success;
    });
  }

  getPlatformName(platform: string): string {
    switch (platform) {
      case 'tiktok':
        return 'TikTok';
      case 'youtube':
        return 'YouTube';
      case 'instagram':
        return 'Instagram';
      case 'facebook':
        return 'Facebook';
      default:
        return platform;
    }
  }
}
