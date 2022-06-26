define([
    "require",
    "exports",
    "module"
], function(require, exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    console.log(new URL(module.uri, document.baseURI).href);
});
