/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-dom/recommended",
    "prettier",
  ],
  plugins: ["unused-imports", "jest", "jest-dom"],
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
      typescript: {
        alwaysTryTypes: true,
        // this resolves packages import problems
        project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
      },
    },
  },
  rules: {
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
      },
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "jsx-a11y/alt-text": [
      2,
      {
        elements: ["img", "object", "area", 'input[type="image"]'],
        img: [],
        object: ["Object"],
        area: ["Area"],
        'input[type="image"]': ["InputImage"],
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.*"] },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      extends: ["plugin:@typescript-eslint/recommended", "prettier"],
      rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "react/require-default-props": "off",
        "@typescript-eslint/no-floating-promises": ["error"],
        "no-void": ["error", { allowAsStatement: true }],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/consistent-type-imports": ["warn"],
      },
    },
  ],
};
