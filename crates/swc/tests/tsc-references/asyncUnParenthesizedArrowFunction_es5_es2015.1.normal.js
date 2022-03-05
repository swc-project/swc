import * as swcHelpers from "@swc/helpers";
const x = function() {
    var _ref = swcHelpers.asyncToGenerator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x(i) {
        return _ref.apply(this, arguments);
    };
}();
const x1 = function() {
    var _ref = swcHelpers.asyncToGenerator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x1(i) {
        return _ref.apply(this, arguments);
    };
}();
