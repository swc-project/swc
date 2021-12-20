// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @module: commonjs
// @Filename: thing.js
'use strict';
// @Filename: reexport.js
'use strict';
class Thing {
}
module.exports = {
    Thing
};
const Thing = require('./thing').Thing;
module.exports = {
    Thing
};
