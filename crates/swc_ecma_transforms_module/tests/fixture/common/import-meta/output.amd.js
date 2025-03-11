define([
    "require",
    "module"
], function(require, module) {
    "use strict";
    const react = require.toUrl("react");
    const url = new URL(module.uri, document.baseURI).href;
    const filename = module.uri.split("/").pop();
    const dirname = require.toUrl(".");
    console.log(react, url, filename, dirname);
});
