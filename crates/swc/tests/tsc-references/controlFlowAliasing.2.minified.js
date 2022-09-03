//// [controlFlowAliasing.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f10(x) {}
function f11(x) {}
function f12(x) {}
function f13(x) {}
function f14(x) {
    return void 0 !== x ? x : 0;
}
function f15(obj) {
    "string" == typeof obj.x && obj.x;
}
function f16(obj) {
    var isString = "string" == typeof obj.x;
    obj = {
        x: 42
    }, isString && obj.x;
}
function f17(obj) {
    "string" == typeof obj[0] && obj[0];
}
function f18(obj) {
    var isString = "string" == typeof obj[0];
    obj = [
        42
    ], isString && obj[0];
}
function f20(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f21(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f22(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f23(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f24(arg) {
    var obj = arg;
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f25(arg) {
    var obj = arg;
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f26(outer) {
    "foo" === outer.obj.kind ? outer.obj.foo : outer.obj.bar;
}
function f27(outer) {
    "foo" === outer.obj.kind ? outer.obj.foo : outer.obj.bar;
}
function f28(obj) {
    var isFoo = obj && "foo" === obj.kind, isBar = obj && "bar" === obj.kind;
    isFoo && obj.foo, isBar && obj.bar;
}
function f30(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f31(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f32(obj) {
    "foo" === obj.kind ? obj.foo : obj.bar;
}
function f33(obj) {
    var kind = obj.kind;
    switch(kind){
        case "foo":
            obj.foo;
            break;
        case "bar":
            obj.bar;
    }
}
var C10 = function C10(x) {
    "use strict";
    _class_call_check(this, C10), this.x = x, "string" == typeof this.x && "string" == typeof x && this.x;
}, C11 = function C11(x) {
    "use strict";
    _class_call_check(this, C11), this.x = x;
    var thisX_isString = "string" == typeof this.x, xIsString = "string" == typeof x;
    thisX_isString && xIsString ? (this.x, x) : (this.x = 10, x = 10);
};
function f40(obj) {
    "foo" == obj.kind && obj.foo && obj.foo;
}
function gg2(obj) {
    obj.kind, obj.payload;
}
function foo(param) {
    param.kind, param.payload;
}
var obj = {
    fn: function() {
        return !0;
    }
}, a = obj.fn();
