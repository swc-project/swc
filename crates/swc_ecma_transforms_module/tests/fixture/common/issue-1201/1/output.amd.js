define([
    "module"
], function(module) {
    "use strict";
    console.log(new URL(module.uri, document.baseURI).href);
});
