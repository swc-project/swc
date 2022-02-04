// @module: commonjs
// @Filename: foo1.ts
class x {
}
module.exports = x;
// @Filename: foo2.ts
const foo1 = require('./foo1');
module.exports = {
    x: foo1
};
// @Filename: foo3.ts
const foo2 = require('./foo2');
class x extends foo2.x {
}
export { };
