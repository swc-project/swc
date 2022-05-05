// Inject jest's assertion (expect) into global scope for the Mocha
// to use same assertion between node-swc & rest.
global.expect = require("expect");
