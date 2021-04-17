const cssnano = require("cssnano");
const postcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const postcssImport = require("postcss-import");
const postcssNormalize = require("postcss-normalize");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    postcssImport(),
    postcssFlexbugsFixes(),
    postcssPresetEnv({
      autoprefixer: {
        cascade: true,
        add: true,
        remove: true,
        supports: true,
        flexbox: "no-2009",
        grid: "autoplace",
      },
      stage: 3,
    }),
    postcssNormalize(),
    cssnano({ preset: "default" }),
  ],
};
