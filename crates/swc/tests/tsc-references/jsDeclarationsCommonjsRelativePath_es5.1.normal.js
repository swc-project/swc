// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @module: commonjs
// @Filename: thing.js
'use strict';
// @Filename: reexport.js
'use strict';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Thing = function Thing() {
    _classCallCheck(this, Thing);
};
module.exports = {
    Thing: Thing
};
var Thing = require('./thing').Thing;
module.exports = {
    Thing: Thing
};
