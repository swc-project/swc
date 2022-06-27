class x {
}
require('./foo1');
const foo2 = require('./foo2');
class x extends foo2.x {
}
module.exports = x;
