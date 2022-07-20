// @Filename: /a.ts
class A {
}
export { A };
// @Filename: /c.ts
import * as types from './b';
export { types as default };
// @Filename: /d.ts
import types from './c';
new types.A();
new types.B();
const a = {};
const b = {};
