//// [tsxExternalModuleEmit1.tsx]
//// [react.d.ts]
//// [app.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "App", {
    enumerable: !0,
    get: function() {
        return App;
    }
});
var _call_super = require("@swc/helpers/_/_call_super"), _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _react = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("react")), _button = require("./button"), App = /*#__PURE__*/ function(_React_Component) {
    function App() {
        return _class_call_check._(this, App), _call_super._(this, App, arguments);
    }
    return _inherits._(App, _React_Component), App.prototype.render = function() {
        return _react.createElement(_button.Button, null);
    }, App;
}(_react.Component);
//// [button.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Button", {
    enumerable: !0,
    get: function() {
        return Button;
    }
});
var _call_super = require("@swc/helpers/_/_call_super"), _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _react = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("react")), Button = /*#__PURE__*/ function(_React_Component) {
    function Button() {
        return _class_call_check._(this, Button), _call_super._(this, Button, arguments);
    }
    return _inherits._(Button, _React_Component), Button.prototype.render = function() {
        return _react.createElement("button", null, "Some button");
    }, Button;
}(_react.Component);
