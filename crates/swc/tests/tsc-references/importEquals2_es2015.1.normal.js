// @Filename: /b.ts
import * as a from './a';
// @esModuleInterop: true
// @Filename: /a.ts
class A {
}
// @Filename: /c.ts
const a = require('./b');
new a.A(); // Error
module.exports = a;
