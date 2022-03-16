import * as swcHelpers from "@swc/helpers";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = swcHelpers.asyncToGenerator(function*(context, args) {
                const { objects  } = yield {
                    objects: 12
                };
                return swcHelpers.objectSpread({}, connectionFromArray(objects, args));
            });
            return function(context, args) {
                return _ref.apply(this, arguments);
            };
        }()
    };
}
rootConnection('test');
