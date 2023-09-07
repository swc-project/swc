//// [typeofThis.ts]
var Test6, f, Test7, f1, Test61, Test71;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
Test6 = Test61 || (Test61 = {}), f = function() {}, Object.defineProperty(Test6, "f", {
    enumerable: !0,
    get: function() {
        return f;
    },
    set: function(v) {
        f = v;
    }
}), Test7 = Test71 || (Test71 = {}), f1 = function() {}, Object.defineProperty(Test7, "f", {
    enumerable: !0,
    get: function() {
        return f1;
    },
    set: function(v) {
        f1 = v;
    }
});
