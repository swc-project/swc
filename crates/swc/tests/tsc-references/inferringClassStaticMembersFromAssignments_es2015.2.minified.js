export class C1 {
}
C1.staticProp = 0;
export function F1() {}
F1.staticProp = 0;
export var C2 = class {
};
C2.staticProp = 0;
export let F2 = function() {};
F2.staticProp = 0, (class {
}).staticProp = 0, (function() {}).staticProp = 0, (class {
}).staticProp = 0, (function() {}).staticProp = 0;
import * as a from "./a";
a.C1.staticProp, a.C2.staticProp, a.F1.staticProp, a.F2.staticProp, C3.staticProp, C4.staticProp, F3.staticProp, F4.staticProp;
