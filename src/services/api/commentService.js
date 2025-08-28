import commentsData from "@/services/mockData/comments.json";

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.comments];
  }

  async getByPostId(postId) {
    await this.delay(200);
    return this.comments.filter(c => c.postId === String(postId));
  }

  async getById(id) {
    await this.delay(150);
    const comment = this.comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    return { ...comment };
  }

  async create(commentData) {
    await this.delay(300);
    const newComment = {
      ...commentData,
      Id: Math.max(...this.comments.map(c => c.Id), 0) + 1,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.comments.unshift(newComment);
    return { ...newComment };
  }

  async approve(id) {
    await this.delay(200);
    const comment = this.comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    comment.status = "approved";
    return { ...comment };
  }

  async reject(id) {
    await this.delay(200);
    const comment = this.comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    comment.status = "spam";
    return { ...comment };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Comment with id ${id} not found`);
    }
    this.comments.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const commentService = new CommentService();