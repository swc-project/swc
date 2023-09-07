//// [ClassAndModuleThatMergeWithModuleMemberThatUsesClassTypeParameter.ts]
// all expected to be errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var clodule3, y, clodule1 = function clodule1() {
    _class_call_check(this, clodule1);
};
clodule1 || (clodule1 = {});
var clodule2 = function clodule2() {
    _class_call_check(this, clodule2);
};
clodule2 || (clodule2 = {});
var clodule31 = function clodule3() {
    _class_call_check(this, clodule3);
};
clodule3 = clodule31 || (clodule31 = {}), y = {
    id: T
}, Object.defineProperty(clodule3, "y", {
    enumerable: !0,
    get: function() {
        return y;
    },
    set: function(v) {
        y = v;
    }
});
var clodule4 = function clodule4() {
    _class_call_check(this, clodule4);
};
clodule4 || (clodule4 = {});
