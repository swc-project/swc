import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var RC1 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC1, _Component);
    var _super = _create_super(RC1);
    function RC1() {
        _class_call_check(this, RC1);
        return _super.apply(this, arguments);
    }
    var _proto = RC1.prototype;
    _proto.render = function render() {
        return null;
    };
    return RC1;
}(React.Component);
var RC2 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC2, _Component);
    var _super = _create_super(RC2);
    function RC2() {
        _class_call_check(this, RC2);
        return _super.apply(this, arguments);
    }
    var _proto = RC2.prototype;
    _proto.render = function render() {
        return null;
    };
    _proto.method = function method() {};
    return RC2;
}(React.Component);
var RC3 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC3, _Component);
    var _super = _create_super(RC3);
    function RC3() {
        _class_call_check(this, RC3);
        return _super.apply(this, arguments);
    }
    var _proto = RC3.prototype;
    _proto.render = function render() {
        return null;
    };
    return RC3;
}(React.Component);
var RC4 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC4, _Component);
    var _super = _create_super(RC4);
    function RC4() {
        _class_call_check(this, RC4);
        return _super.apply(this, arguments);
    }
    var _proto = RC4.prototype;
    _proto.render = function render() {
        return null;
    };
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
