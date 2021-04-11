const babelPresetReact = [
  "@babel/preset-react",
  {
    // Enable new JSX syntax.
    // See: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
    runtime: "automatic",
  },
];

const babelPresetTypescript = [
  "@babel/preset-typescript",
  {
    isTSX: true,
    allExtensions: true,
    allowNamespaces: true,
    allowDeclareFields: true,
    onlyRemoveTypeImports: true, // Only Typescript >= 3.8
  },
];

const babelPluginTransformRemoveConsole = [
  "transform-remove-console",
  { exclude: ["error", "warn"] },
];
const babelPluginTransformReactConstantElements = [
  "@babel/plugin-transform-react-constant-elements",
];

/**
 * @type {babel.ConfigFunction}
 */
module.exports = (api) => {
  api.cache.forever();

  return {
    env: {
      production: {
        presets: [babelPresetReact, babelPresetTypescript],
        plugins: [
          babelPluginTransformRemoveConsole,
          babelPluginTransformReactConstantElements,
        ],
      },
      development: {
        presets: [babelPresetReact, babelPresetTypescript],
        plugins: [babelPluginTransformReactConstantElements],
      },
    },
  };
};
