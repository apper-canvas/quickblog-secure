import postsData from "@/services/mockData/posts.json";

class PostService {
constructor() {
    this.posts = [...postsData];
    // Initialize version service if available
    this.initializeVersionService();
  }

  async initializeVersionService() {
    try {
      const { versionService } = await import('./versionService.js');
      this.versionService = versionService;
    } catch (error) {
      console.log('Version service not available');
      this.versionService = null;
    }
  }

  async getAll() {
    await this.delay(300);
    return [...this.posts];
  }

  async getById(id) {
    await this.delay(200);
    const post = this.posts.find(p => p.Id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return { ...post };
  }

  async create(postData) {
await this.delay(400);
    const newPost = {
      ...postData,
      Id: Math.max(...this.posts.map(p => p.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      readTime: this.calculateReadTime(postData.content || ""),
      galleries: postData.galleries || [],
      videoEmbeds: postData.videoEmbeds || [],
      captions: postData.captions || {}
    };
    this.posts.unshift(newPost);
    
    // Create initial version if version service is available
    if (this.versionService) {
      await this.versionService.createVersion(newPost.Id, newPost, 'Initial version');
    }
    
    return { ...newPost };
  }

  async update(id, postData) {
    await this.delay(350);
    const index = this.posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    
const originalPost = { ...this.posts[index] };
    const updatedPost = {
      ...originalPost,
      ...postData,
      updatedAt: new Date().toISOString(),
      readTime: this.calculateReadTime(postData.content || originalPost.content || ""),
      galleries: postData.galleries || originalPost.galleries || [],
      videoEmbeds: postData.videoEmbeds || originalPost.videoEmbeds || [],
      captions: postData.captions || originalPost.captions || {}
    };
    
    this.posts[index] = updatedPost;
    
    // Create version if content changed and version service is available
    if (this.versionService && this.hasSignificantChanges(originalPost, updatedPost)) {
      await this.versionService.createVersion(
        updatedPost.Id, 
        updatedPost, 
        this.generateChangeDescription(originalPost, updatedPost)
      );
    }
    
    return { ...updatedPost };
  }

  hasSignificantChanges(original, updated) {
    return (
      original.title !== updated.title ||
      original.content !== updated.content ||
      original.excerpt !== updated.excerpt ||
      original.status !== updated.status ||
      JSON.stringify(original.tags) !== JSON.stringify(updated.tags)
    );
  }

  generateChangeDescription(original, updated) {
    const changes = [];
    if (original.title !== updated.title) changes.push('title');
    if (original.content !== updated.content) changes.push('content');
    if (original.excerpt !== updated.excerpt) changes.push('excerpt');
    if (original.status !== updated.status) changes.push(`status to ${updated.status}`);
    if (JSON.stringify(original.tags) !== JSON.stringify(updated.tags)) changes.push('tags');
    
    return changes.length > 0 ? `Updated ${changes.join(', ')}` : 'Minor changes';
  }

  async delete(id) {
    await this.delay(250);
    const index = this.posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    this.posts.splice(index, 1);
    return true;
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const postService = new PostService();