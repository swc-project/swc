//// [importEqualsDeclaration.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
//// [/b.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var SomeClass = function SomeClass() {
    "use strict";
    _class_call_check(this, SomeClass);
};
export { };
//// [/c.ts]
A.prototype; // Error
var a = {
    a: 'a'
}; // Ok
void type; // Ok
export { };
 // Ok
