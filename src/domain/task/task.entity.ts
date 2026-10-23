/**
 * @file task.entity.ts
 * @description Task entity representing a todo item in the domain layer.
 */

export default class Task {
    public id: string | null;
    public title: string;
    public description: string;
    public isCompleted: boolean;
    public tags: string[];
    public authorId: string;
    public createdAt: Date;
    public updatedAt: Date;

    /**
     * Creates a new Task instance.
     * @param {string|null} id - Task ID (null for new tasks).
     * @param {string} title - Task title.
     * @param {string} description - Task description.
     * @param {boolean} isCompleted - Task completion status.
     * @param {string[]} tags - Task tags.
     * @param {string} authorId - Author's user ID.
     * @param {Date} [createdAt] - Creation timestamp.
     * @param {Date} [updatedAt] - Last update timestamp.
     */
    constructor(
        id: string | null,
        title: string,
        description: string,
        isCompleted: boolean,
        tags: string[],
        authorId: string,
        createdAt: Date | null = null,
        updatedAt: Date | null = null
    ) {
        if (!title || !authorId) {
            throw new Error('Task must have a title and authorId');
        }

        this.id = id;
        this.title = title;
        this.description = description || '';
        this.isCompleted = isCompleted || false;
        this.tags = tags || [];
        this.authorId = authorId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Domain methods related to Task

    /**
     * Updates the task title.
     * @param {string} newTitle - The new title for the task.
     * @throws {Error} If the new title is empty.
     */
    updateTitle(newTitle: string): void {
        if (!newTitle || newTitle.trim() === '') {
            throw new Error('Task title cannot be empty');
        }
        this.title = newTitle.trim();
        this._markAsUpdated();
    }

    /**
     * Updates the task description.
     * @param {string} newDescription - The new description for the task.
     */
    updateDescription(newDescription: string): void {
        this.description = newDescription ? newDescription.trim() : '';
        this._markAsUpdated();
    }

    /**
     * Marks the task as completed.
     */
    complete(): void {
        this.isCompleted = true;
        this._markAsUpdated();
    }

    /**
     * Marks the task as incomplete/pending.
     */
    uncomplete(): void {
        this.isCompleted = false;
        this._markAsUpdated();
    }

    /**
     * Toggles the task completion status.
     */
    toggleCompletion(): void {
        this.isCompleted = !this.isCompleted;
        this._markAsUpdated();
    }

    /**
     * Adds a tag to the task.
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
     * Removes a tag from the task.
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
     * Checks if the task has a specific tag.
     * @param {string} tag - The tag to check.
     * @returns {boolean} True if the task has the tag.
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
     * Checks if the given user is the author of this task.
     * @param {string} userId - The user ID to check.
     * @returns {boolean} True if the user is the author.
     */
    isAuthor(userId: string): boolean {
        return this.authorId === userId;
    }

    /**
     * Marks the task as updated by setting the updatedAt timestamp.
     * @private
     */
    private _markAsUpdated(): void {
        this.updatedAt = new Date();
    }

    /**
     * Converts the task to a plain object.
     * @returns {Object} Plain object representation.
     */
    toJSON(): object {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isCompleted: this.isCompleted,
            tags: this.tags,
            authorId: this.authorId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
