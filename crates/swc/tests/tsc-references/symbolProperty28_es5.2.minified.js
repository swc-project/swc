import * as swcHelpers from "@swc/helpers";
var c, _toStringTag = Symbol.toStringTag, C1 = function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    return swcHelpers.createClass(C1, [
        {
            key: _toStringTag,
            value: function() {
                return {
                    x: ""
                };
            }
        }
    ]), C1;
}(), C2 = function(C1) {
    "use strict";
    swcHelpers.inherits(C2, C1);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        return swcHelpers.classCallCheck(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(C1);
c[Symbol.toStringTag]().x;
