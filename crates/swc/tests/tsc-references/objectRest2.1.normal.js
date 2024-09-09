//// [objectRest2.ts]
// test for #12203
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
function rootConnection(name) {
    return {
        resolve: /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*(context, args) {
                const { objects } = yield {
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
