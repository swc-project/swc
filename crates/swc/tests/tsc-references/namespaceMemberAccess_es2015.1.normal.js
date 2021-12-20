// @Filename: /b.ts
import * as types from './a';
// @Filename: /a.ts
class A {
}
types.A;
const { A  } = types;
