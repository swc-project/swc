import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function _foo() {
    return (_foo = _async_to_generator(function() {
        var C, c;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return _ = function(_B) {
                        "use strict";
                        _inherits(C, _B);
                        var _super = _create_super(C);
                        function C() {
                            return _class_call_check(this, C), _super.apply(this, arguments);
                        }
                        return C;
                    }, [
                        4,
                        import("./0")
                    ];
                case 1:
                    return (c = new (C = _.apply(void 0, [
                        _state.sent().B
                    ]))()).print(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
!function() {
    return _foo.apply(this, arguments);
}();
