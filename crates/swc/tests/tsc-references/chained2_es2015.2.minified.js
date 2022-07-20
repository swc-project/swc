class A {
}
import * as types from './b';
import types from './c';
new types.A(), new types.B();
export { A, types as default };
