module.exports = {
  extends: ["xo-react", "plugin:react/jsx-runtime"],
  prettier: true,
  space: true,
  // Ignore generated files
  ignores: ["packages/client/src/routeTree.gen.ts"],
  overrides: [
    {
      files: "**/*.tsx",
      // envs: ['es2021', 'browser'],
      rules: {
        // "react/react-in-jsx-scope": "off",
        "unicorn/filename-case": [
          "error",
          {
            case: "pascalCase",
          },
        ],
        "n/file-extension-in-import": "off",
        "import/extensions": "off",
      },
    },
    {
      // File based routes are camelCase
      files: ["packages/client/src/routes/*.tsx"],
      rules: {
        "unicorn/filename-case": [
          "error",
          {
            case: "camelCase",
          },
        ],
      },
    },
    {
      files: "**/*.ts",
      rules: {
        "import/extensions": "off",
        "n/file-extension-in-import": "off",
      },
    },
  ],
};
