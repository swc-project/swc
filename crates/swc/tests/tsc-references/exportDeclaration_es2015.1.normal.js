// @Filename: /a.ts
class A {
}
export { };
// @Filename: /b.ts
import { A } from './a';
new A();
