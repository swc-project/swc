import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
!function(name) {
    var _ref;
    return {
        resolve: (_ref = _async_to_generator(function*(context, args) {
            let { objects  } = yield {
                objects: 12
            };
            return _object_spread({}, connectionFromArray(objects, args));
        }), function(context, args) {
            return _ref.apply(this, arguments);
        })
    };
}('test');
