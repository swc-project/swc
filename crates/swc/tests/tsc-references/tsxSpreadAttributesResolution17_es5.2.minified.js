import * as swcHelpers from "@swc/helpers";
export var Empty = function(_Component) {
    "use strict";
    swcHelpers.inherits(Empty, _Component);
    var _super = swcHelpers.createSuper(Empty);
    function Empty() {
        return swcHelpers.classCallCheck(this, Empty), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Empty, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Hello");
            }
        }
    ]), Empty;
}(React.Component);
React.createElement(Empty, swcHelpers.extends({}, obj));
