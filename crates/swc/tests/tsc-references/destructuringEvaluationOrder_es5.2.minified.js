import * as swcHelpers from "@swc/helpers";
var trace = [], order = function(n) {
    return trace.push(n);
}, tmp = void 0;
(void 0 === tmp ? order(0) : tmp)[order(1)];
var tmp1 = {};
(void 0 === tmp1 ? order(0) : tmp1)[order(1)];
var _ref = {}, key = order(0), key1 = order(2), tmp2 = _ref[key];
(void 0 === tmp2 ? order(1) : tmp2)[key1], swcHelpers.objectWithoutProperties(_ref, [
    key
].map(swcHelpers.toPropertyKey));
var _ref1 = [
    {
        x: 1
    }
], __ref = swcHelpers.slicedToArray(_ref1, 2), ref = (__ref[0], null !== ref ? ref : swcHelpers._throw(new TypeError("Cannot destructure undefined")));
__ref[1], swcHelpers.extends({}, _ref1[0]);
