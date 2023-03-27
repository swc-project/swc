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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
var _button = require("./button");
var App = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(App, _React_Component);
    var _super = _create_super(App);
    function App() {
        _class_call_check(this, App);
        return _super.apply(this, arguments);
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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
var Button = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Button, _React_Component);
    var _super = _create_super(Button);
    function Button() {
        _class_call_check(this, Button);
        return _super.apply(this, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ _react.createElement("button", null, "Some button");
    };
    return Button;
}(_react.Component);
