import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
!function(name) {
    var _ref;
    return {
        resolve: (_ref = _async_to_generator(function(context, args) {
            var objects, _tmp, _tmp1;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            ((_tmp = {}).objects = 12, _tmp)
                        ];
                    case 1:
                        return [
                            2,
                            _object_spread(_tmp1 = {}, connectionFromArray(objects = _state.sent().objects, args))
                        ];
                }
            });
        }), function(context, args) {
            return _ref.apply(this, arguments);
        })
    };
}("test");
