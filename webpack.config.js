const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const escapeStringRegexp = require("escape-string-regexp");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const argvEnvironments = ["production", "development"];
const assertEnv = (env) => {
  const envCount = Object.keys(env).filter((key) =>
    argvEnvironments.includes(key)
  ).length;

  // `webpack`に`--env production`と`--env development`のどちらか1つが指定されている必要がある。
  if (envCount !== 1) {
    throw new Error(
      `Invalid --env option: must specify build environment option, one of "webpack --env production" or "webpack --env development"`
    );
  }
};

const isProductionEnv = (env) => Boolean(env.production);

/**
 * @type {webpack.ConfigurationFactory}
 */
module.exports = (env, _argv) => {
  assertEnv(env);

  const isProduction = isProductionEnv(env);
  const isDevelopment = !isProduction;

  const webpackMode = isProduction ? "production" : "development";
  const outputPath = path.resolve(__dirname, "dist/");
  const tsConfigFile = "tsconfig.json";
  const publicPath = "/";

  const babelLoader = {
    loader: "babel-loader",
    options: { cacheDirectory: true },
  };

  const sourceRoot = path.resolve(__dirname, "src");
  const enableEsModule = true;
  const sourceMap = isDevelopment ? "source-map" : false;
  const sourceMapEnabled = isDevelopment;

  /**
   * @param {webpack.Configuration} webpackConfig
   * @returns {webpack.Configuration}
   */
  const mergeWebpackConfig = (webpackConfig) => {
    if (isProduction) {
      const plugins = webpackConfig.plugins ? webpackConfig.plugins : [];

      plugins.push(
        new CompressionPlugin({
          test: /\.(js|css)$/,
          algorithm: "gzip",
          compressionOptions: { level: 9 },
          deleteOriginalAssets: false,
        })
      );

      return { ...webpackConfig, plugins };
    } else {
      // NOTE: devServer.publicPath always starts and ends with a forward slash.
      const devServerPublicPath = path.posix.join("/", publicPath, "./");
      // NOTE: Specifies the URI of the server that is to serve the static file
      //  for the React-router entry point.
      //  Example: const routerPrefixURI = path.posix.join("/", publicPath + "/ui", "./");
      const routerPrefixURI = path.posix.join("/", publicPath, "./");

      return {
        ...webpackConfig,
        devServer: {
          contentBase: false,
          port: 8080,
          publicPath: devServerPublicPath,
          // NOTE: Rewrite configuration for React-router that uses BrowserHistory.
          //  Internally replace the URI prefix for SPA request on DEV servers
          //  with `devServerPublicPath`.
          historyApiFallback: {
            rewrites: [
              {
                from: new RegExp(`^${escapeStringRegexp(routerPrefixURI)}`),
                to: devServerPublicPath,
              },
            ],
          },
          index: "index.html",
          hot: true,
          hotOnly: true,
          overlay: true,
        },
      };
    }
  };

  /** @type {webpack.Configuration} */
  const webpackBaseConfig = {
    mode: webpackMode,
    target: "browserslist",
    entry: {
      index: "./src/index.tsx",
    },
    output: {
      path: outputPath,
      publicPath: publicPath,
      filename: "js/[name].[contenthash].js",
      chunkFilename: "js/[id].[contenthash].js",
      assetModuleFilename: "static/[name][contenthash][ext][query]",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: ["node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [sourceRoot],
          use: [babelLoader],
        },
        {
          test: /\.tsx?$/,
          include: [sourceRoot],
          use: [babelLoader],
        },
        {
          // NOTE: CSS loader with settings for CSS Modules.
          test: /\.css$/,
          include: [sourceRoot],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: publicPath,
                emit: true,
                esModule: enableEsModule,
              },
            },
            {
              loader: "css-loader",
              options: {
                url: true,
                import: true,
                sourceMap: sourceMapEnabled,
                importLoaders: 1,
                esModule: enableEsModule,
                modules: {
                  mode: "local",
                  exportLocalsConvention: "asIs",
                  exportOnlyLocals: false,
                },
              },
            },
          ],
        },
        {
          // NOTE: webpack v5 and later, supports emit static resources.
          test: /\.(woff|woff2|eot|ttf)$/,
          type: "asset/resource",
          generator: {
            filename: "font/[name][contenthash][ext][query]",
          },
          include: [sourceRoot],
        },
        {
          test: /\.(png|jpg|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "image/[name][contenthash][ext][query]",
          },
          include: [sourceRoot],
        },
      ],
    },
    plugins: [
      // NOTE: Transpile typescript by babel but do not run type check,
      //  ForkTsCheckerWebpackPlugin will do the type checking instead.
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: tsConfigFile,
          mode: "write-tsbuildinfo",
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        chunks: ["index"],
        templateContent: `
        <!DOCTYPE html>
        <html>
          <head>
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
        `,
        filename: "index.html",
        inject: true,
        title: "cypress-playground",
        meta: {
          viewport: "minimum-scale=1, initial-scale=1, width=device-width",
          charset: "UTF-8",
        },
        scriptLoading: "blocking",
        base: false,
        xhtml: false,
      }),
      // NOTE: Added <meta http-equiv="..."> instead of
      //  `Content-Security-Policy` HTTP header.
      new CspHtmlWebpackPlugin(
        {
          "base-uri": ["'self'"],
          "object-src": ["'none'"],
          "font-src": ["'self'"],
          "script-src": ["'self'"],
          // NOTE: If use CSS in JS modules then allow `'unsafe-inline'`.
          //  Example: `"style-src": ["'unsafe-inline'", "'self'"]`
          "style-src": ["'self'"],
        },
        {
          enabled: true,
          hashingMethod: "sha256",
          hashEnabled: {
            "script-src": true,
            "style-src": false,
          },
          nonceEnabled: {
            "script-src": false,
            "style-src": false,
          },
        }
      ),
      // NOTE: Emit CSS files by MiniCssExtractPlugin.loader processed.
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        chunkFilename: "css/[id].[contenthash].css",
        ignoreOrder: false,
      }),
      // NOTE: Add environment variables that can be referenced in the webpack
      //  build process.
      // NOTE: `process.env.NODE_ENV` is automatically set from the value of
      //  `optimization.nodeEnv`.
      //  See: https://webpack.js.org/configuration/optimization/#optimizationnodeenv
      new webpack.DefinePlugin({}),
    ],
    optimization: {
      splitChunks: {
        chunks: "initial",
        minChunks: 1,
        cacheGroups: {
          // NOTE: Third party library chunk group.
          vendor: {
            priority: 0,
            name: "vendor",
            filename: "js/[name].[contenthash].js",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            enforce: true,
            reuseExistingChunk: false,
          },
        },
      },
      // NOTE: webpack will set `process.env.NODE_ENV` from the value of
      //  `optimization.nodeEnv`.
      //  See: https://webpack.js.org/configuration/optimization/#optimizationnodeenv
      nodeEnv: webpackMode,
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          test: /\.m?js(\?.*)?$/i,
          extractComments: false,
          terserOptions: {
            sourceMap: sourceMapEnabled,
            compress: {
              ecma: 5,
              comparisons: false,
              // NOTE: Do not use anything other than `inline: 2`.
              //  See: https://github.com/terser-js/terser/issues/120
              inline: 2,
              dead_code: true,
              drop_debugger: true,
              keep_classnames: false,
              keep_fargs: true,
              keep_infinity: false,
              keep_fnames: false,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              ascii_only: true,
              // NOTE: License comment patterns.
              comments: /^\**!|@preserve|@license|@cc_on/i,
            },
          },
        }),
      ],
    },
    devtool: sourceMap,
  };

  return mergeWebpackConfig(webpackBaseConfig);
};
