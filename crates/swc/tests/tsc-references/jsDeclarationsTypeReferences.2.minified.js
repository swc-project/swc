//// [node_modules/@types/node/index.d.ts]
//// [index.js]
/// <reference types="node" />
var thing = new (require("fs")).Something();
module.exports = {
    thing: thing
};
