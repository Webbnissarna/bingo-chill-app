const baseConfig = require("@webbnissarna/bingo-chill-repo-common/eslintrc-node");

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  ...baseConfig,
  overrides: [
    ...baseConfig.overrides,
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
