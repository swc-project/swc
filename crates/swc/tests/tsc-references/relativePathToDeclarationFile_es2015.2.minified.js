module.exports = Test;
const foo = require('foo'), other = require('./other'), relMod = require('./sub/relMod');
foo.M2.x && new relMod(other.M2.x.charCodeAt(0));
export { };
