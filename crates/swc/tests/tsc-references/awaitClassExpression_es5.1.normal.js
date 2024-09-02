//// [awaitClassExpression_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var D, _;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _ = function(_superClass) {
                        "use strict";
                        _inherits(D, _superClass);
                        function D() {
                            _class_call_check(this, D);
                            return _call_super(this, D, arguments);
                        }
                        return D;
                    };
                    return [
                        4,
                        p
                    ];
                case 1:
                    D = /*#__PURE__*/ _.apply(void 0, [
                        _state.sent()
                    ]);
                    return [
                        2
                    ];
            }
        });
    });
    return _func.apply(this, arguments);
}
