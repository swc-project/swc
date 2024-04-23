//// [main.ts]
import { c } from './types';
import * as types from './types';
console.log(c) // Fails as expected, import is still allowed though.
;
console.log(types.c) // Expected an error here.
;
//// [types.ts]
export { };
//// [values.ts]
export var c = 10;
