import * as _a from './b';
// @Filename: d.ts
import { a } from './c';
// @Filename: a.ts
export class A {
}
export { _a as a };
new a.A(); // Error
