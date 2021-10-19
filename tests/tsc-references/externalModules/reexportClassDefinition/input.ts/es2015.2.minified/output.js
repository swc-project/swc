class x {
}
module.exports = x;
const foo1 = require("./foo1");
module.exports = {
    x: foo1
};
const foo2 = require("./foo2");
class x extends foo2.x {
}
export { };
