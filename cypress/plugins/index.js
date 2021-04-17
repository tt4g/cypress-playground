/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require("path");
const fse = require("fs-extra");

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  const configType = config.env.configType;

  return readCypressConfigJson(configType);
};

/**
 * Load {@param configType} cypress configuration.
 *
 * Load cypress configuration file from `../config/cypress.${configType}.json`.
 *
 * @param {string} configType configuration type. Allow {@code "local"}.
 * @returns {Promise} Result of load config json.
 */
const readCypressConfigJson = (configType) => {
  // See: https://docs.cypress.io/api/plugins/configuration-api#Switch-between-multiple-configuration-files
  const configPath = path.resolve(
    __dirname,
    "..",
    "config",
    `cypress.${configType}.json`
  );

  return fse.readJson(configPath);
};
