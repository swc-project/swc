import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = _async_to_generator(function*(context, args) {
                const { objects  } = yield {
                    objects: 12
                };
                return _object_spread({}, connectionFromArray(objects, args));
            });
            return function(context, args) {
                return _ref.apply(this, arguments);
            };
        }()
    };
}
rootConnection('test');
