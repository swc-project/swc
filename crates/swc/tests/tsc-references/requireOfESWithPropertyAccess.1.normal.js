//// [requireOfESWithPropertyAccess.ts]
//// [main.js]
var x = require('./ch').x;
x;
x.grey;
x.x.grey;
//// [ch.js]
var x = {
    grey: {}
};
export { x };
