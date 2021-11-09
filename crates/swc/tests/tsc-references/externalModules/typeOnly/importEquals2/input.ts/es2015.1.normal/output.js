// @Filename: /b.ts
import * as a from './a';
// @esModuleInterop: true
// @Filename: /a.ts
class A {
}
module.exports = a;
// @Filename: /c.ts
const a = require('./b');
new a.A(); // Error
