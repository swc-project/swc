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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var _react = /*#__PURE__*/ _interopRequireWildcard(require("react"));
var _button = require("./button");
var App = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(App, _Component);
    var _super = _createSuper(App);
    function App() {
        _classCallCheck(this, App);
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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var _react = /*#__PURE__*/ _interopRequireWildcard(require("react"));
var Button = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _createSuper(Button);
    function Button() {
        _classCallCheck(this, Button);
        return _super.apply(this, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ _react.createElement("button", null, "Some button");
    };
    return Button;
}(_react.Component);
