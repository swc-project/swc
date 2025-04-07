"use strict";
const react = require.resolve("react");
const url = require("url").pathToFileURL(__filename).toString();
const filename = __filename;
const dirname = __dirname;
console.log(react, url, filename, dirname);
