// @module: commonjs
// @Filename: foo1.ts
class x {
}
// @Filename: foo2.ts
const foo1 = require('./foo1');
// @Filename: foo3.ts
const foo2 = require('./foo2');
class x extends foo2.x {
}
module.exports = {
    x: foo1
};
export { };
