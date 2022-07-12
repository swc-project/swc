// @Filename: /a.ts
// @Filename: /c.ts
import * as types from './b';
// @Filename: /d.ts
import types from './c';
class A {
}
export { A };
export { types as default };
new types.A();
new types.B();
const a = {};
const b = {};
