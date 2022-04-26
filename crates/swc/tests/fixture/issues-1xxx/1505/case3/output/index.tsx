import * as swcHelpers from "@swc/helpers";
var Component = function Component() {
    "use strict";
    swcHelpers.classCallCheck(this, Component);
};
var ComponentType = function ComponentType() {
    "use strict";
    swcHelpers.classCallCheck(this, ComponentType);
};
var withTeamsForUser = function(_WrappedComponent) {
    var _class = /*#__PURE__*/ function(Component) {
        "use strict";
        swcHelpers.inherits(_class, Component);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(Component);
    _class.displayName = "x";
    return _class;
};
