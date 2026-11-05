import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
// test case from node-swc/tests/issue-2546/input.ts
import { injectable } from 'inversify';
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
};
export { MyClass as default };
MyClass = _ts_decorate([
    injectable()
], MyClass);
// required to got error from test
console.log(a);
var a = 1;
