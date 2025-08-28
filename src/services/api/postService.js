import postsData from "@/services/mockData/posts.json";

class PostService {
  constructor() {
    this.posts = [...postsData];
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
      readTime: this.calculateReadTime(postData.content || "")
    };
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, postData) {
    await this.delay(350);
    const index = this.posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    
    const updatedPost = {
      ...this.posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
      readTime: this.calculateReadTime(postData.content || this.posts[index].content || "")
    };
    
    this.posts[index] = updatedPost;
    return { ...updatedPost };
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