module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parse",
  env: { browser: true, node: true, es6: true },
  parserOptions: {
    sourcetype: "module",
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0,
  },
};
