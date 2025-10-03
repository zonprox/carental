import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules",
      "coverage",
      "dist",
      "build",
      "tests/**/*.js",
      "**/*.test.js",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
