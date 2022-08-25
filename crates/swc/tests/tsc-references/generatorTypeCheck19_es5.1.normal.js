//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    return Bar;
}(Foo);
function g() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent();
                return [
                    5,
                    _ts_values([
                        new Bar
                    ])
                ];
            case 2:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
