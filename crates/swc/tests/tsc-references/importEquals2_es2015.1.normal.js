// @esModuleInterop: true
// @Filename: /a.ts
class A {
}
export { };
// @Filename: /b.ts
import * as a from './a';
module.exports = a;
// @Filename: /c.ts
const a = require('./b');
new a.A(); // Error
export { };
