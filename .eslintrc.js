module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
            rules: {
                '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
                '@typescript-eslint/no-explicit-any': 'warn',
                'no-var': 'warn',
            },
        },
    ],
    rules: {
        'no-unused-vars': 'off',
        'no-console': 'off',
        'prefer-const': 'error',
        eqeqeq: ['error', 'always'],
        curly: ['error', 'all'],
    },
};
