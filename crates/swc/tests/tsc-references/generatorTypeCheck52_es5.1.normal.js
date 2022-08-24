//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
function g() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    new Foo
                ];
            case 1:
                _state.sent();
                return [
                    4,
                    new Baz
                ];
            case 2:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
