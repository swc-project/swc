// @declaration: true
// @target: es2015
// @module: es2015, commonjs, esnext
// @filename: 0.ts
export const a = 1;
export const b = 2;
// @filename: 1.ts
export { a, b } from './0';
export * from './0';
import * as _ns from './0';
export { _ns as ns };
// @filename: 2.ts
export { a, b } from './0';
export { a as c, b as d } from './0';
