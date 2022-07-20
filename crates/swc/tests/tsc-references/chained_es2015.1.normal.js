// @Filename: /a.ts
class A {
}
export { B as C } from './a';
// @Filename: /d.ts
import { D } from './c';
new D();
const d = {};
