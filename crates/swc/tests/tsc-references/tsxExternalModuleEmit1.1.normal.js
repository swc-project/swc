//// [tsxExternalModuleEmit1.tsx]
"use strict";
//// [react.d.ts]
"use strict";
//// [app.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
var _button = require("./button");
var App = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits._(App, _React_Component);
    function App() {
        _class_call_check._(this, App);
        return _call_super._(this, App, arguments);
    }
    var _proto = App.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ _react.createElement(_button.Button, null);
    };
    return App;
}(_react.Component);
//// [button.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Button", {
    enumerable: true,
    get: function() {
        return Button;
    }
});
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
var Button = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits._(Button, _React_Component);
    function Button() {
        _class_call_check._(this, Button);
        return _call_super._(this, Button, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ _react.createElement("button", null, "Some button");
    };
    return Button;
}(_react.Component);
