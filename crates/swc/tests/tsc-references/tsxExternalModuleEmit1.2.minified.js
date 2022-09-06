//// [tsxExternalModuleEmit1.tsx]
"use strict";
//// [react.d.ts]
"use strict";
//// [app.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "App", {
    enumerable: !0,
    get: function() {
        return App;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _createSuper = require("@swc/helpers/lib/_create_super.js").default, _react = _interopRequireWildcard(require("react")), _button = require("./button"), App = function(_Component) {
    "use strict";
    _inherits(App, _Component);
    var _super = _createSuper(App);
    function App() {
        return _classCallCheck(this, App), _super.apply(this, arguments);
    }
    return App.prototype.render = function() {
        return _react.createElement(_button.Button, null);
    }, App;
}(_react.Component);
//// [button.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Button", {
    enumerable: !0,
    get: function() {
        return Button;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _createSuper = require("@swc/helpers/lib/_create_super.js").default, _react = _interopRequireWildcard(require("react")), Button = function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _createSuper(Button);
    function Button() {
        return _classCallCheck(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return _react.createElement("button", null, "Some button");
    }, Button;
}(_react.Component);
