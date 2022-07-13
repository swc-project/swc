// @Filename: /a.ts
// @Filename: /d.ts
import { D } from './c';
class A {
}
export { B as C } from './a';
new D();
const d = {};
