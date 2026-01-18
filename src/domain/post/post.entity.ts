/**
 * @file post.entity.ts
 * @description Post entity representing a blog post in the domain layer.
 */

export default class Post {
  public id: string | null;
  public title: string;
  public content: string;
  public tags: string[];
  public authorId: string;
  public createdAt: Date;
  public updatedAt: Date;

  /**
   * Creates a new Post instance.
   * @param {string|null} id - Post ID (null for new posts).
   * @param {string} title - Post title.
   * @param {string} content - Post content.
   * @param {string[]} tags - Post tags.
   * @param {string} authorId - Author's user ID.
   * @param {Date} [createdAt] - Creation timestamp.
   * @param {Date} [updatedAt] - Last update timestamp.
   */
  constructor(
    id: string | null,
    title: string,
    content: string,
    tags: string[],
    authorId: string,
    createdAt: Date | null = null,
    updatedAt: Date | null = null
  ) {
    if (!title || !content || !authorId) {
      throw new Error('Post must have a title, content, and authorId');
    }

    this.id = id;
    this.title = title;
    this.content = content;
    this.tags = tags || [];
    this.authorId = authorId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Domain methods related to Post

  /**
   * Updates the post title.
   * @param {string} newTitle - The new title for the post.
   * @throws {Error} If the new title is empty.
   */
  updateTitle(newTitle: string): void {
    if (!newTitle || newTitle.trim() === '') {
      throw new Error('Post title cannot be empty');
    }
    this.title = newTitle.trim();
    this._markAsUpdated();
  }

  /**
   * Updates the post content.
   * @param {string} newContent - The new content for the post.
   * @throws {Error} If the new content is empty.
   */
  updateContent(newContent: string): void {
    if (!newContent || newContent.trim() === '') {
      throw new Error('Post content cannot be empty');
    }
    this.content = newContent.trim();
    this._markAsUpdated();
  }

  /**
   * Adds a tag to the post.
   * @param {string} tag - The tag to add.
   * @throws {Error} If the tag is empty or already exists.
   */
  addTag(tag: string): void {
    if (!tag || tag.trim() === '') {
      throw new Error('Tag cannot be empty');
    }

    const normalizedTag = tag.trim().toLowerCase();

    if (this.tags.includes(normalizedTag)) {
      throw new Error(`Tag "${normalizedTag}" already exists`);
    }

    this.tags.push(normalizedTag);
    this._markAsUpdated();
  }

  /**
   * Removes a tag from the post.
   * @param {string} tag - The tag to remove.
   * @throws {Error} If the tag doesn't exist.
   */
  removeTag(tag: string): void {
    if (!tag || tag.trim() === '') {
      throw new Error('Tag cannot be empty');
    }

    const normalizedTag = tag.trim().toLowerCase();
    const index = this.tags.indexOf(normalizedTag);

    if (index === -1) {
      throw new Error(`Tag "${normalizedTag}" not found`);
    }

    this.tags.splice(index, 1);
    this._markAsUpdated();
  }

  /**
   * Checks if the post has a specific tag.
   * @param {string} tag - The tag to check.
   * @returns {boolean} True if the post has the tag.
   */
  hasTag(tag: string): boolean {
    if (!tag) {
      return false;
    }
    return this.tags.includes(tag.trim().toLowerCase());
  }

  /**
   * Replaces all tags with a new set.
   * @param {string[]} newTags - The new tags array.
   */
  setTags(newTags: string[]): void {
    if (!Array.isArray(newTags)) {
      throw new Error('Tags must be an array');
    }

    this.tags = newTags.map((tag) => tag.trim().toLowerCase()).filter((tag) => tag !== '');
    this._markAsUpdated();
  }

  /**
   * Checks if the given user is the author of this post.
   * @param {string} userId - The user ID to check.
   * @returns {boolean} True if the user is the author.
   */
  isAuthor(userId: string): boolean {
    return this.authorId === userId;
  }

  /**
   * Gets a summary of the post content.
   * @param {number} [maxLength=150] - Maximum length of the summary.
   * @returns {string} The content summary.
   */
  getSummary(maxLength: number = 150): string {
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return this.content.substring(0, maxLength).trim() + '...';
  }

  /**
   * Marks the post as updated by setting the updatedAt timestamp.
   * @private
   */
  private _markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  /**
   * Converts the post to a plain object.
   * @returns {Object} Plain object representation.
   */
  toJSON(): object {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      tags: this.tags,
      authorId: this.authorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
