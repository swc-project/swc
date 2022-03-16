// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @module: commonjs
// @Filename: thing.js
'use strict';
// @Filename: reexport.js
'use strict';
import * as swcHelpers from "@swc/helpers";
var Thing = function Thing() {
    swcHelpers.classCallCheck(this, Thing);
};
module.exports = {
    Thing: Thing
};
var Thing = require('./thing').Thing;
module.exports = {
    Thing: Thing
};
