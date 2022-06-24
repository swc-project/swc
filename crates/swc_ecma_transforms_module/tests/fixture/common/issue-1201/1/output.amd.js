define([
    "require",
    "module"
], function(require, module) {
    "use strict";
    console.log(new URL(module.uri, document.baseURI).href);
});
