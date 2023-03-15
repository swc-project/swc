//// [objectRest2.ts]
// test for #12203
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = _async_to_generator(function*(context, args) {
                const { objects  } = yield {
                    objects: 12
                };
                return _extends({}, connectionFromArray(objects, args));
            });
            return function(context, args) {
                return _ref.apply(this, arguments);
            };
        }()
    };
}
rootConnection('test');
