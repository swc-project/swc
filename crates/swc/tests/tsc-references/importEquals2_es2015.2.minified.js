export { };
import * as a from './a';
module.exports = a;
let a = require('./b');
new a.A();
export { };
