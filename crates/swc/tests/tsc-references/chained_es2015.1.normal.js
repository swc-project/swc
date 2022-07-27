// @Filename: /a.ts
class A {
}
export { };
// @Filename: /b.ts
export { B as C } from './a';
// @Filename: /c.ts
export { };
// @Filename: /d.ts
import { D } from './c';
new D();
const d = {};
