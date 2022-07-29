export { };
import A from './a';
export { A };
import * as types from './b';
export { types as default };
import types from './c';
new types.A(), new types.B();
