class x {
}
require('./foo1');
let foo2 = require('./foo2');
class x extends foo2.x {
}
module.exports = x;
export { };
