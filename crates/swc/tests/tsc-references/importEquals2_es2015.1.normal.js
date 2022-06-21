// @esModuleInterop: true
// @Filename: /a.ts
class A {
}
// @Filename: /c.ts
const a = require('./b');
new a.A(); // Error
module.exports = a;
export { };
