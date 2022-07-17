// @esModuleInterop: true
// @Filename: /a.ts
// @Filename: /b.ts
import * as a from './a';
class A {
}
// @Filename: /c.ts
const a = require('./b');
new a.A(); // Error
module.exports = a;
