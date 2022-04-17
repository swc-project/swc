class x {
}
module.exports = x;
let foo1 = require('./foo1');
module.exports = {
    x: foo1
};
let foo2 = require('./foo2');
class x extends foo2.x {
}
export { };
