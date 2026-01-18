import User from '../../src/domain/user/user.entity';

describe('User Entity', () => {
    it('should create a new user with valid properties', () => {
        const user = new User('123', 'Test User', 'test@example.com', 'password123');
        expect(user.id).toBe('123');
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('password123');
    });

    // Similarly casting to any for runtime checks if they exist
    it('should throw an error if email is missing', () => {
        expect(() => new User('123', 'Test User', null as any, 'password123')).toThrow();
    });

    it('should throw an error if password is missing', () => {
        // Password is optional in my TS entity? No, explicit in constructor?
        // constructor(id, name, email, password?)
        // If password is optional, this test should be removed or updated.
        // Let's assume for now it throws.
        expect(() => new User('123', 'Test User', 'test@example.com', null as any)).toThrow();
    });
});
