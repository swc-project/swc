// @Filename: /c.ts
import * as types from './b';
// @Filename: /d.ts
import types from './c';
// @Filename: /a.ts
class A {
}
export { A };
export { types as default };
new types.A();
new types.B();
const a = {
};
const b = {
};
