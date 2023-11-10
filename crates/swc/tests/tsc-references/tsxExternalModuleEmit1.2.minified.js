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
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), _create_super = require("@swc/helpers/_/_create_super"), _react = _interop_require_wildcard._(require("react")), _button = require("./button"), App = function(_React_Component) {
    _inherits._(App, _React_Component);
    var _super = _create_super._(App);
    function App() {
        return _class_call_check._(this, App), _super.apply(this, arguments);
    }
    return App.prototype.render = function() {
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
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), _create_super = require("@swc/helpers/_/_create_super"), _react = _interop_require_wildcard._(require("react")), Button = function(_React_Component) {
    _inherits._(Button, _React_Component);
    var _super = _create_super._(Button);
    function Button() {
        return _class_call_check._(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return _react.createElement("button", null, "Some button");
    }, Button;
}(_react.Component);
