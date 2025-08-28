class AIService {
  constructor() {
    this.commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
    
    this.titleTemplates = [
      'How to {action} {topic}',
      '{number} Ways to {action} {topic}',
      'The Ultimate Guide to {topic}',
      'Why {topic} {verb} in {year}',
      '{topic}: Everything You Need to Know',
      'The Future of {topic}',
      '{topic} Best Practices',
      'Understanding {topic}',
      '{topic} Tips for Beginners'
    ];
  }

  async generateTitles(content) {
    await this.delay(800);
    
    const keywords = this.extractKeywords(content, 5);
    const mainTopic = keywords[0] || 'Technology';
    
    const titles = [];
    
    // Generate template-based titles
    const actions = ['master', 'improve', 'understand', 'optimize', 'build'];
    const verbs = ['matters', 'works', 'succeeds', 'evolves', 'transforms'];
    const currentYear = new Date().getFullYear();
    
    titles.push(
      this.titleTemplates[0].replace('{action}', actions[Math.floor(Math.random() * actions.length)]).replace('{topic}', mainTopic),
      this.titleTemplates[1].replace('{number}', Math.floor(Math.random() * 10) + 3).replace('{action}', actions[Math.floor(Math.random() * actions.length)]).replace('{topic}', mainTopic),
      this.titleTemplates[2].replace('{topic}', mainTopic)
    );
    
    // Generate content-based titles
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim();
      const words = firstSentence.split(' ').slice(0, 8);
      titles.push(words.join(' ') + (words.length === 8 ? '...' : ''));
    }
    
    return titles.slice(0, 3);
  }

  async generateSummaries(content) {
    await this.delay(1000);
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summaries = [];
    
    if (sentences.length >= 3) {
      // Extract key sentences
      const keySentences = sentences.slice(0, 3).map(s => s.trim());
      summaries.push(keySentences.join('. ') + '.');
      
      // Create a shorter version
      const keywords = this.extractKeywords(content, 8);
      summaries.push(`This article explores ${keywords.slice(0, 3).join(', ')} and provides insights on ${keywords.slice(3, 6).join(', ')}.`);
    } else {
      // Fallback summaries
      const keywords = this.extractKeywords(content, 5);
      summaries.push(`An exploration of ${keywords.slice(0, 2).join(' and ')} with practical insights and recommendations.`);
      summaries.push(`Learn about ${keywords.join(', ')} and their applications in modern contexts.`);
    }
    
    return summaries.slice(0, 2);
  }

  async generateKeywords(content) {
    await this.delay(600);
    
    const keywords = this.extractKeywords(content, 12);
    
    // Add some topic-related keywords based on content analysis
    const techKeywords = ['technology', 'innovation', 'development', 'digital', 'software', 'web', 'programming', 'design'];
    const businessKeywords = ['strategy', 'management', 'leadership', 'growth', 'productivity', 'success', 'business'];
    const contentKeywords = ['content', 'writing', 'communication', 'storytelling', 'marketing', 'audience'];
    
    let suggestedKeywords = [...keywords];
    
    const contentLower = content.toLowerCase();
    
    if (techKeywords.some(word => contentLower.includes(word))) {
      suggestedKeywords.push(...techKeywords.filter(k => !suggestedKeywords.includes(k)).slice(0, 2));
    }
    
    if (businessKeywords.some(word => contentLower.includes(word))) {
      suggestedKeywords.push(...businessKeywords.filter(k => !suggestedKeywords.includes(k)).slice(0, 2));
    }
    
    if (contentKeywords.some(word => contentLower.includes(word))) {
      suggestedKeywords.push(...contentKeywords.filter(k => !suggestedKeywords.includes(k)).slice(0, 2));
    }
    
    return suggestedKeywords.slice(0, 10);
  }

  extractKeywords(text, limit = 10) {
    // Clean and tokenize
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !this.commonWords.includes(word) &&
        !/^\d+$/.test(word)
      );
    
    // Count frequency
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiService = new AIService();