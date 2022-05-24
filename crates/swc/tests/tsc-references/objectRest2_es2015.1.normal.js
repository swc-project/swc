import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
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
