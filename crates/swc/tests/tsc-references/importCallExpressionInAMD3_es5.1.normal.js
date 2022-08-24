// @module: amd
// @target: esnext
// @filename: 0.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.print = function print() {
        return "I am B";
    };
    return B;
}();
// @filename: 2.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        var C, c;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _ = function(_B) {
                        "use strict";
                        _inherits(C, _B);
                        var _super = _create_super(C);
                        function C() {
                            _class_call_check(this, C);
                            return _super.apply(this, arguments);
                        }
                        return C;
                    };
                    return [
                        4,
                        import("./0")
                    ];
                case 1:
                    C = /*#__PURE__*/ _.apply(void 0, [
                        _state.sent().B
                    ]);
                    c = new C();
                    c.print();
                    return [
                        2
                    ];
            }
        });
    });
    return _foo.apply(this, arguments);
}
foo();
