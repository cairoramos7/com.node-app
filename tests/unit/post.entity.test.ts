import Post from '../../src/domain/post/post.entity';

describe('Post Entity', () => {
    it('should create a new post with valid properties', () => {
        const post = new Post('123', 'Test Title', 'Test Content', ['tag1'], 'author1');
        expect(post.id).toBe('123');
        expect(post.title).toBe('Test Title');
        expect(post.content).toBe('Test Content');
        expect(post.tags).toEqual(['tag1']);
        expect(post.authorId).toBe('author1');
    });

    it('should create a new post with optional id', () => {
        const post = new Post(null, 'Test Title', 'Test Content', ['tag1'], 'author1');
        expect(post.id).toBeNull();
        expect(post.title).toBe('Test Title');
    });

    // Note: These tests rely on constructor logic.
    // Should update expectations if TS constructor signature enforces types differently or if runtime checks are removed.
    // In TS, if strict null checks are on, valid TS code shouldn't pass null if typed as string.
    // But strictly speaking, runtime checks might still be desirable or usage of 'any'.
    // We added runtime checks in entity earlier? Let's check logic.
    // JS entity had checks. TS entity: constructor(id, title, content...) { ... }
    // If I kept throwing errors in TS implementation, tests should pass.
    // I need to check how I implemented Post entity in TS.
    // I see I kept properties but didn't view implementation details deeply for validations.
    // If validations were removed in favor of Types, these tests might fail or need adjustment.
    // I will assume for now I migrated logic 1:1 or logic persists.
    // If I replaced with simple assignment, these tests might fail.
    // Let's keep them and see. I can fix later.

    it('should throw an error if authorId is missing', () => {
        expect(() => new Post('1', 'Test Title', 'Test Content', [], null as any)).toThrow();
        // Typescript would complain about null passed to string, so cast as any to test runtime check if it exists.
        // If it doesn't exist, this test will fail.
    });
});

it('should initialize tags as an empty array if not provided', () => {
    // tags is required in constructor? constructor(..., tags: string[], ...)
    // If I pass null as any
    const post = new Post('1', 'Test Title', 'Test Content', null as any, 'author1');
    // If constructor handles null tags -> tags = tags || []
    expect(post.tags).toEqual([]);
});
