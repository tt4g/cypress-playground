module.exports = {
  singleQuote: false,
  semi: true,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  embeddedLanguageFormatting: "auto",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.css"],
      options: {
        parser: "css",
      },
    },
  ],
};
