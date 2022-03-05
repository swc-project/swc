import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var RC1 = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(RC1, _Component);
    var _super = swcHelpers.createSuper(RC1);
    function RC1() {
        swcHelpers.classCallCheck(this, RC1);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(RC1, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC1;
}(React.Component);
var RC2 = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(RC2, _Component);
    var _super = swcHelpers.createSuper(RC2);
    function RC2() {
        swcHelpers.classCallCheck(this, RC2);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(RC2, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        },
        {
            key: "method",
            value: function method() {}
        }
    ]);
    return RC2;
}(React.Component);
var RC3 = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(RC3, _Component);
    var _super = swcHelpers.createSuper(RC3);
    function RC3() {
        swcHelpers.classCallCheck(this, RC3);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(RC3, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC3;
}(React.Component);
var RC4 = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(RC4, _Component);
    var _super = swcHelpers.createSuper(RC4);
    function RC4() {
        swcHelpers.classCallCheck(this, RC4);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(RC4, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC4;
}(React.Component);
var RCComp = RC1 || RC2;
var EmptyRCComp = RC3 || RC4;
var PartRCComp = RC1 || RC4;
// Error
var a = /*#__PURE__*/ React.createElement(RCComp, {
    x: true
});
var b = /*#__PURE__*/ React.createElement(PartRCComp, {
    x: 10
});
var c = /*#__PURE__*/ React.createElement(EmptyRCComp, {
    prop: true
});
export { };
