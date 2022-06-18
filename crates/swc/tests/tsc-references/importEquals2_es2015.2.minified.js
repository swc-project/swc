import * as a from './a';
let a = require('./b');
new a.A(), module.exports = a;
