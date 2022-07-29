module.exports = class {
};
export { };
let foo1 = require('./foo1');
module.exports = {
    x: foo1
};
export { };
let foo2 = require('./foo2');
class x extends foo2.x {
}
export { };
