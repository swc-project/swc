// @lib: es2015
// @target: es2015
// test for #12203
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = _async_to_generator(function(context, args) {
                var objects, _tmp, _tmp1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _tmp = {};
                            return [
                                4,
                                (_tmp.objects = 12, _tmp)
                            ];
                        case 1:
                            objects = _state.sent().objects;
                            _tmp1 = {};
                            return [
                                2,
                                _object_spread(_tmp1, connectionFromArray(objects, args))
                            ];
                    }
                });
            });
            return function(context, args) {
                return _ref.apply(this, arguments);
            };
        }()
    };
}
rootConnection("test");
