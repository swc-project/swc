import * as swcHelpers from "@swc/helpers";
var React = require("react");
export function makeP(Ctor) {
    return (function(_PureComponent) {
        "use strict";
        swcHelpers.inherits(_class, _PureComponent);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            return swcHelpers.classCallCheck(this, _class), _super.apply(this, arguments);
        }
        return _class.prototype.render = function() {
            return React.createElement(Ctor, swcHelpers.extends({}, this.props));
        }, _class;
    })(React.PureComponent);
}
