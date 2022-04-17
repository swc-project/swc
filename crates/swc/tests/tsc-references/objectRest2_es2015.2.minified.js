import * as swcHelpers from "@swc/helpers";
!function(name) {
    var _ref;
    return {
        resolve: (_ref = swcHelpers.asyncToGenerator(function*(context, args) {
            let { objects  } = yield {
                objects: 12
            };
            return swcHelpers.objectSpread({}, connectionFromArray(objects, args));
        }), function(context, args) {
            return _ref.apply(this, arguments);
        })
    };
}('test');
