//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var RC1 = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(RC1, _React_Component);
    function RC1() {
        _class_call_check(this, RC1);
        return _call_super(this, RC1, arguments);
    }
    var _proto = RC1.prototype;
    _proto.render = function render() {
        return null;
    };
    return RC1;
}(React.Component);
var RC2 = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(RC2, _React_Component);
    function RC2() {
        _class_call_check(this, RC2);
        return _call_super(this, RC2, arguments);
    }
    var _proto = RC2.prototype;
    _proto.render = function render() {
        return null;
    };
    _proto.method = function method() {};
    return RC2;
}(React.Component);
var RC3 = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(RC3, _React_Component);
    function RC3() {
        _class_call_check(this, RC3);
        return _call_super(this, RC3, arguments);
    }
    var _proto = RC3.prototype;
    _proto.render = function render() {
        return null;
    };
    return RC3;
}(React.Component);
var RC4 = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(RC4, _React_Component);
    function RC4() {
        _class_call_check(this, RC4);
        return _call_super(this, RC4, arguments);
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
