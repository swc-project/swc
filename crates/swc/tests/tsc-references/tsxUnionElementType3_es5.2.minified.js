import * as swcHelpers from "@swc/helpers";
var React = require("react"), RC1 = function(_Component) {
    "use strict";
    swcHelpers.inherits(RC1, _Component);
    var _super = swcHelpers.createSuper(RC1);
    function RC1() {
        return swcHelpers.classCallCheck(this, RC1), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(RC1, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC1;
}(React.Component), RC2 = function(_Component) {
    "use strict";
    swcHelpers.inherits(RC2, _Component);
    var _super = swcHelpers.createSuper(RC2);
    function RC2() {
        return swcHelpers.classCallCheck(this, RC2), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(RC2, [
        {
            key: "render",
            value: function() {
                return null;
            }
        },
        {
            key: "method",
            value: function() {}
        }
    ]), RC2;
}(React.Component), RC3 = function(_Component) {
    "use strict";
    swcHelpers.inherits(RC3, _Component);
    var _super = swcHelpers.createSuper(RC3);
    function RC3() {
        return swcHelpers.classCallCheck(this, RC3), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(RC3, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC3;
}(React.Component), RC4 = function(_Component) {
    "use strict";
    swcHelpers.inherits(RC4, _Component);
    var _super = swcHelpers.createSuper(RC4);
    function RC4() {
        return swcHelpers.classCallCheck(this, RC4), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(RC4, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC4;
}(React.Component), EmptyRCComp = RC3 || RC4, PartRCComp = RC1 || RC4;
React.createElement(RC1 || RC2, {
    x: "Hi"
}), React.createElement(EmptyRCComp, null), React.createElement(EmptyRCComp, {
    "data-prop": "hello"
}), React.createElement(PartRCComp, null), React.createElement(PartRCComp, {
    "data-extra": "hello"
});
