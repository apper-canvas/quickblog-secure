class VersionService {
  constructor() {
    this.versions = this.loadVersions();
  }

  loadVersions() {
    // In a real app, this would load from a database
    // For now, we'll use localStorage to persist versions
    const stored = localStorage.getItem('post_versions');
    return stored ? JSON.parse(stored) : [];
  }

  saveVersions() {
    localStorage.setItem('post_versions', JSON.stringify(this.versions));
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getVersionsByPostId(postId) {
    await this.delay(150);
    return this.versions
      .filter(v => v.postId === postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getVersionById(versionId) {
    await this.delay(100);
    const version = this.versions.find(v => v.Id === versionId);
    if (!version) {
      throw new Error(`Version with id ${versionId} not found`);
    }
    return { ...version };
  }

  async createVersion(postId, postData, changeDescription = 'Auto-save') {
    await this.delay(200);
    
    const newVersion = {
      Id: Math.max(...this.versions.map(v => v.Id), 0) + 1,
      postId: postId,
      versionNumber: this.getNextVersionNumber(postId),
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      status: postData.status,
      tags: postData.tags ? [...postData.tags] : [],
      changeDescription,
      createdAt: new Date().toISOString(),
      createdBy: 'Author', // In a real app, this would be the current user
      wordCount: this.calculateWordCount(postData.content || ''),
      characterCount: (postData.content || '').length
    };

    this.versions.unshift(newVersion);
    this.saveVersions();
    
    return { ...newVersion };
  }

  async restoreVersion(postId, versionId) {
    await this.delay(300);
    
    const version = await this.getVersionById(versionId);
    if (version.postId !== postId) {
      throw new Error('Version does not belong to this post');
    }

    // Create a restoration version
    const restorationVersion = await this.createVersion(
      postId,
      {
        title: version.title,
        content: version.content,
        excerpt: version.excerpt,
        status: version.status,
        tags: version.tags
      },
      `Restored from version ${version.versionNumber}`
    );

    return {
      title: version.title,
      content: version.content,
      excerpt: version.excerpt,
      status: version.status,
      tags: version.tags,
      restorationVersion
    };
  }

  async deleteVersion(versionId) {
    await this.delay(150);
    const index = this.versions.findIndex(v => v.Id === versionId);
    if (index === -1) {
      throw new Error(`Version with id ${versionId} not found`);
    }
    
    this.versions.splice(index, 1);
    this.saveVersions();
  }

  getNextVersionNumber(postId) {
    const postVersions = this.versions.filter(v => v.postId === postId);
    return postVersions.length + 1;
  }

  calculateWordCount(content) {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Compare two versions and return differences
  compareVersions(version1, version2) {
    const differences = {
      title: version1.title !== version2.title,
      content: version1.content !== version2.content,
      excerpt: version1.excerpt !== version2.excerpt,
      status: version1.status !== version2.status,
      tags: JSON.stringify(version1.tags) !== JSON.stringify(version2.tags)
    };

    return {
      hasDifferences: Object.values(differences).some(Boolean),
      differences,
      wordCountDiff: version2.wordCount - version1.wordCount,
      characterCountDiff: version2.characterCount - version1.characterCount
    };
  }
}

export const versionService = new VersionService();