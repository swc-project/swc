//// [awaitClassExpression_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    return (_func = _async_to_generator(function() {
        var D;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return _ = function(_superClass) {
                        "use strict";
                        _inherits(D, _superClass);
                        var _super = _create_super(D);
                        function D() {
                            return _class_call_check(this, D), _super.apply(this, arguments);
                        }
                        return D;
                    }, [
                        4,
                        p
                    ];
                case 1:
                    return D = _.apply(void 0, [
                        _state.sent()
                    ]), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
