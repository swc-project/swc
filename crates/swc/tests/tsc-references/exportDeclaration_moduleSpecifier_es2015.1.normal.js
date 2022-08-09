// @Filename: /a.ts
export class A {
}
// @Filename: /b.ts
export { };
// @Filename: /c.ts
import { A } from './b';
new A();
