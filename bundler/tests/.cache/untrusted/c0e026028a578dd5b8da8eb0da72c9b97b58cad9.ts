// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/template.js


import _ from '../deps/lodash@4.17.15/index.js';
const template = _.template;

const readFile = Deno.readFile;
const writeFile = Deno.writeFile;

/**
 * Light wrapper over lodash templates making it safer to be used with javascript source code.
 *
 * In particular, doesn't interfere with use of interpolated strings in javascript.
 *
 * @param {string} content Template source
 * @param {_.TemplateOptions} options Template options
 */
export const jsSourceTemplate = (content, options) =>
  template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options,
  });

/**
 * Compile the contents of specified (javascript) file as a lodash template
 *
 * @param {string} filePath Path of file to be used as template
 * @param {_.TemplateOptions} options Lodash template options
 */
export const jsFileTemplate = async (filePath, options) => {
  const contentBuffer = await readFile(filePath);
  return jsSourceTemplate(contentBuffer.toString(), options);
};

/**
 * Write a javascript file using another file as a (lodash) template
 *
 * @param {string} targetFilePath
 * @param {string} sourceFilePath
 * @param {_.TemplateOptions} options options passed to lodash templates
 */
export const writeJsFileUsingTemplate = async (
  targetFilePath,
  sourceFilePath,
  options,
  variables
) =>
  writeFile(
    targetFilePath,
    (await jsFileTemplate(sourceFilePath, options))(variables)
  );

export default {
  jsSourceTemplate,
  jsFileTemplate,
  writeJsFileUsingTemplate,
};
