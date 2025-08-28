import mediaData from "@/services/mockData/media.json";

class MediaService {
  constructor() {
    this.media = [...mediaData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.media];
  }

  async getById(id) {
    await this.delay(150);
    const mediaItem = this.media.find(m => m.Id === id);
    if (!mediaItem) {
      throw new Error(`Media with id ${id} not found`);
    }
    return { ...mediaItem };
  }

  async create(file) {
    await this.delay(800); // Simulate upload time
    
    // Generate mock media data
    const newMedia = {
      Id: Math.max(...this.media.map(m => m.Id), 0) + 1,
      url: this.generateMockUrl(file),
      thumbnailUrl: this.generateMockThumbnailUrl(file),
      type: file.type?.startsWith("video/") ? "video" : "image",
      filename: file.name || `file_${Date.now()}`,
      alt: file.name?.replace(/\.[^/.]+$/, "") || "Uploaded media",
      size: file.size || Math.floor(Math.random() * 500000) + 100000,
      dimensions: {
        width: 1200,
        height: 800
      },
      uploadedAt: new Date().toISOString()
    };
    
    this.media.unshift(newMedia);
    return { ...newMedia };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.media.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error(`Media with id ${id} not found`);
    }
    this.media.splice(index, 1);
    return true;
  }

  generateMockUrl(file) {
    // In a real app, this would return the actual uploaded file URL
    const isVideo = file.type?.startsWith("video/");
    const baseUrl = "https://images.unsplash.com";
    const imageIds = [
      "photo-1498050108023-c5249f4df085",
      "photo-1555099962-4199c345e5dd",
      "photo-1507003211169-0a1dd7228f2d",
      "photo-1555066931-4365d14bab8c",
      "photo-1517077304055-6e89abbf09b0"
    ];
    
    if (isVideo) {
      return "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
    }
    
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    return `${baseUrl}/${randomId}?w=1200&q=80`;
  }

  generateMockThumbnailUrl(file) {
    const isVideo = file.type?.startsWith("video/");
    
    if (isVideo) {
      return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&q=80";
    }
    
    return this.generateMockUrl(file).replace("w=1200", "w=300");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mediaService = new MediaService();