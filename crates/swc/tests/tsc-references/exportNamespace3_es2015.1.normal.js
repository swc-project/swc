// @Filename: a.ts
export class A {
}
// @Filename: b.ts
export { };
// @Filename: c.ts
import * as _a from './b';
export { _a as a };
// @Filename: d.ts
import { a } from './c';
new a.A(); // Error
