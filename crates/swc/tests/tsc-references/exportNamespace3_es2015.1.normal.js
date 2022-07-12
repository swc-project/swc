// @Filename: a.ts
import * as _a from './b';
// @Filename: d.ts
import { a } from './c';
export class A {
}
export { _a as a };
new a.A(); // Error
