// @Filename: foo1.ts
export function x() {
    return true;
}
// @Filename: foo2.ts
const foo1 = require('./foo1');
module.exports = foo1.x;
