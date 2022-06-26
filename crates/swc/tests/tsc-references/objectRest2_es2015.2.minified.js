import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
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
