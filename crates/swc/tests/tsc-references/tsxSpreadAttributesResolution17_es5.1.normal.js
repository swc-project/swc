import * as swcHelpers from "@swc/helpers";
export var Empty = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Empty, _Component);
    var _super = swcHelpers.createSuper(Empty);
    function Empty() {
        swcHelpers.classCallCheck(this, Empty);
        return _super.apply(this, arguments);
    }
    var _proto = Empty.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Empty;
}(React.Component);
// OK
var unionedSpread = /*#__PURE__*/ React.createElement(Empty, swcHelpers.extends({}, obj));
