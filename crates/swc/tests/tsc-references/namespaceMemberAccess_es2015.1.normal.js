// @Filename: /a.ts
class A {
}
export { };
// @Filename: /b.ts
import * as types from './a';
types.A;
const { A  } = types;
