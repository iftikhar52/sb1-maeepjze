import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, VideoContent } from '../../services/content.service';

@Component({
  selector: 'app-content-list',
  template: `
    <div class="content-list-container">
      <div class="content-header">
        <h1>Content Library</h1>
        <div class="content-actions">
          <button class="btn btn-primary" (click)="navigateToUpload()">
            <i class="material-icons">add</i> New Upload
          </button>
        </div>
      </div>
      
      <div class="content-filters">
        <div class="search-container">
          <i class="material-icons">search</i>
          <input 
            type="text" 
            placeholder="Search content..." 
            class="search-input"
            [(ngModel)]="searchQuery"
            (input)="filterContent()"
          >
        </div>
        
        <div class="filter-options">
          <div class="filter-item">
            <label>Status:</label>
            <select [(ngModel)]="statusFilter" (change)="filterContent()">
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label>Platform:</label>
            <select [(ngModel)]="platformFilter" (change)="filterContent()">
              <option value="all">All Platforms</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label>Sort By:</label>
            <select [(ngModel)]="sortBy" (change)="filterContent()">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="content-grid" *ngIf="filteredContent.length > 0; else noContent">
        <div class="content-card" *ngFor="let item of filteredContent">
          <div class="content-thumbnail">
            <img [src]="item.thumbnailUrl" alt="{{ item.title }}">
            <div class="content-status" [ngClass]="'status-' + item.status">
              {{ item.status }}
            </div>
          </div>
          
          <div class="content-info">
            <h3 class="content-title">{{ item.title }}</h3>
            <p class="content-date">{{ formatDate(item.createdAt) }}</p>
            
            <div class="content-platforms">
              <div class="platform-badge platform-tiktok" *ngIf="item.platforms.tiktok">TikTok</div>
              <div class="platform-badge platform-youtube" *ngIf="item.platforms.youtube">YouTube</div>
              <div class="platform-badge platform-instagram" *ngIf="item.platforms.instagram">Instagram</div>
              <div class="platform-badge platform-facebook" *ngIf="item.platforms.facebook">Facebook</div>
            </div>
          </div>
          
          <div class="content-actions">
            <button class="btn btn-icon" (click)="editContent(item.id)">
              <i class="material-icons">edit</i>
            </button>
            <button class="btn btn-icon" (click)="deleteContent(item.id)">
              <i class="material-icons">delete</i>
            </button>
          </div>
        </div>
      </div>
      
      <ng-template #noContent>
        <div class="empty-state">
          <div class="empty-icon">
            <i class="material-icons">video_library</i>
          </div>
          <div class="empty-text">No content found</div>
          <button class="btn btn-primary" (click)="navigateToUpload()">Create New Content</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .content-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .content-actions .btn i {
      margin-right: var(--space-1);
      font-size: 18px;
      vertical-align: text-bottom;
    }
    
    .content-filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      background-color: var(--surface);
      padding: var(--space-3);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    
    .search-container {
      position: relative;
      flex: 1;
      min-width: 200px;
    }
    
    .search-container i {
      position: absolute;
      left: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-hint);
    }
    
    .search-input {
      width: 100%;
      padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
      border: 1px solid var(--divider);
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
    }
    
    .filter-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    
    .filter-item label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .filter-item select {
      padding: var(--space-1) var(--space-2);
      border: 1px solid var(--divider);
      border-radius: 4px;
      font-size: 0.875rem;
      background-color: var(--surface);
      cursor: pointer;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-3);
    }
    
    .content-card {
      background-color: var(--surface);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .content-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .content-thumbnail {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 177.78%; /* 9:16 aspect ratio */
      overflow: hidden;
    }
    
    .content-thumbnail img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .content-status {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-draft {
      background-color: var(--text-hint);
      color: white;
    }
    
    .status-scheduled {
      background-color: var(--warning);
      color: black;
    }
    
    .status-published {
      background-color: var(--success);
      color: white;
    }
    
    .content-info {
      padding: var(--space-3);
    }
    
    .content-title {
      margin-bottom: var(--space-1);
      font-size: 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .content-date {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: var(--space-2);
    }
    
    .content-platforms {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
    }
    
    .content-actions {
      display: flex;
      justify-content: flex-end;
      padding: var(--space-2) var(--space-3);
      border-top: 1px solid var(--divider);
    }
    
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .btn-icon:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
    }
    
    .btn-icon:last-child:hover {
      color: var(--error);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-6) 0;
      background-color: var(--surface);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
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
    
    @media (max-width: 768px) {
      .content-filters {
        flex-direction: column;
      }
      
      .filter-options {
        width: 100%;
      }
      
      .filter-item {
        width: 100%;
      }
      
      .filter-item select {
        flex: 1;
      }
      
      .content-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }
  `]
})
export class ContentListComponent implements OnInit {
  contentList: VideoContent[] = [];
  filteredContent: VideoContent[] = [];
  searchQuery = '';
  statusFilter = 'all';
  platformFilter = 'all';
  sortBy = 'newest';
  
  constructor(
    private router: Router,
    private contentService: ContentService
  ) {}
  
  ngOnInit(): void {
    this.loadContent();
  }
  
  loadContent(): void {
    this.contentService.getContentList().subscribe(content => {
      this.contentList = content;
      this.filterContent();
    });
  }
  
  filterContent(): void {
    let filtered = [...this.contentList];
    
    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.description.toLowerCase().includes(query) ||
               item.hashtags.some(tag => tag.toLowerCase().includes(query));
      });
    }
    
    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }
    
    // Filter by platform
    if (this.platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platforms[this.platformFilter as keyof typeof item.platforms]);
    }
    
    // Sort content
    switch (this.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    this.filteredContent = filtered;
  }
  
  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }
  
  editContent(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/content', id]);
    }
  }
  
  deleteContent(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      // In a real app, this would call the contentService.deleteContent method
      // this.contentService.deleteContent(id).then(() => {
      //   this.loadContent();
      // });
      
      // For now, we'll just filter it out of the UI
      this.contentList = this.contentList.filter(item => item.id !== id);
      this.filterContent();
    }
  }
  
  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  }
}