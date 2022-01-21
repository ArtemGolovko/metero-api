module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
    },
    extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
