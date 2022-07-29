export class A {
}
export { };
import * as _a from './b';
export { _a as a };
import { a } from './c';
new a.A();
