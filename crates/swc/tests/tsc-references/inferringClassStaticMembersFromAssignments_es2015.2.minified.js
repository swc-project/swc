import * as a from "./a";
export class C1 {
}
C1.staticProp = 0;
export function F1() {}
F1.staticProp = 0;
export var C2 = class {
};
C2.staticProp = 0;
export let F2 = function() {};
F2.staticProp = 0;
class C3 {
}
function F3() {}
C3.staticProp = 0, F3.staticProp = 0;
var C4 = class {
};
C4.staticProp = 0;
let F4 = function() {};
F4.staticProp = 0, a.C1.staticProp, a.C2.staticProp, a.F1.staticProp, a.F2.staticProp, C3.staticProp, C4.staticProp, F3.staticProp, F4.staticProp;
