// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @module: commonjs
// @Filename: thing.js
"use strict";
// @Filename: reexport.js
"use strict";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Thing = function Thing() {
    _class_call_check(this, Thing);
};
module.exports = {
    Thing: Thing
};
var Thing = require("./thing").Thing;
module.exports = {
    Thing: Thing
};
