import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @out: output.js
// @allowJs: true
// @filename: a.js
var variable = {};
variable.a = 0;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this.initializedMember = {};
    this.member = {};
    this.member.a = 0;
};
var obj = {
    property: {}
};
obj.property.a = 0;
var arr = [
    {}
];
function getObj() {
    return {};
}
// @filename: b.ts
variable.a = 1;
new C().member.a = 1;
new C().initializedMember.a = 1;
obj.property.a = 1;
arr[0].a = 1;
getObj().a = 1;
