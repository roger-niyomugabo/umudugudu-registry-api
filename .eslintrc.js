module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:sonarjs/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['eslint-plugin-import', 'eslint-plugin-no-null', '@typescript-eslint', 'sonarjs'],
    rules: {
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/typedef': [
            'error',
            {
                parameter: true,
            },
        ],
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
            'off',
            {
                accessibility: 'explicit',
            },
        ],
        '@typescript-eslint/indent': [
            'warn',
            4,
            {
                SwitchCase: 1,
                FunctionDeclaration: {
                    parameters: 'first',
                },
                FunctionExpression: {
                    parameters: 'first',
                },
            },
        ],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: [
                    'public-static-field',
                    'protected-static-field',
                    'private-static-field',
                    'public-static-method',
                    'protected-static-method',
                    'private-static-method',
                    'public-instance-field',
                    'protected-instance-field',
                    'private-instance-field',
                    'public-instance-method',
                    'protected-instance-method',
                    'private-instance-method',
                ],
            },
        ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/type-annotation-spacing': 'error',
        'brace-style': ['error', '1tbs'],
        'comma-dangle': [
            'error',
            {
                objects: 'always-multiline',
                arrays: 'always-multiline',
                functions: 'never',
            },
        ],
        curly: 'error',
        'default-case': 'error',
        'dot-notation': 'off',
        'eol-last': 'error',
        eqeqeq: ['error', 'always'],
        'guard-for-in': 'error',
        'import/order': [
            'error',
            {
                groups: [
                    ['external', 'builtin'],
                    ['internal', 'index', 'sibling', 'parent'],
                ],
            },
        ],
        'jsdoc/check-alignment': 'off',
        'jsdoc/check-indentation': 'off',
        'jsdoc/newline-after-description': 'off',
        'max-len': 'off',
        'no-array-constructor': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'warn',
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-duplicate-case': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-extra-semi': 'error',
        'no-fallthrough': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-multi-str': 'error',
        'no-multiple-empty-lines': 'warn',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-null/no-null': 'off',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-regex-spaces': 'error',
        'no-sparse-arrays': 'error',
        'no-trailing-spaces': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'no-with': 'error',
        'prefer-object-spread': 'error',
        // 'react/no-danger': 'error',
        'spaced-comment': [
            'error',
            'always',
            {
                markers: ['/'],
            },
        ],
        'use-isnan': 'error',
        'no-multiple-empty-lines': [
            'warn',
            {
                max: 1,
                maxEOF: 0,
                maxBOF: 0,
            },
        ],
        'no-multi-spaces': ['warn', { exceptions: { Property: false } }],
        'space-in-parens': 'warn',
        'comma-spacing': 'warn',
        'object-curly-spacing': ['warn', 'always', { arraysInObjects: true, objectsInObjects: true }],
        'array-bracket-spacing': ['warn', 'never'],
        'react/jsx-no-target-blank': 'off',
        'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        'keyword-spacing': ['warn', { before: true, after: true }],
        'prefer-spread': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
        '@typescript-eslint/prefer-as-const': 'error',
        'prefer-const': 'error',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                allowSeparatedGroups: false,
            },
        ],
        '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
        '@typescript-eslint/explicit-function-return-type': [
            'off',
            {
                allowExpressions: true,
            },
        ],
        '@typescript-eslint/no-dynamic-delete': 'error',
        '@typescript-eslint/no-redeclare': [
            'error',
            {
                ignoreDeclarationMerge: true,
            },
        ],
        '@typescript-eslint/no-shadow': [
            'error',
            {
                hoist: 'all',
            },
        ],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: 'next',
            },
        ],
    },
};