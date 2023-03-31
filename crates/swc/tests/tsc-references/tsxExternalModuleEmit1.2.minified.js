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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _create_super = require("@swc/helpers/lib/_create_super.js").default, _react = _interop_require_wildcard(require("react")), _button = require("./button"), App = function(_React_Component) {
    "use strict";
    _inherits(App, _React_Component);
    var _super = _create_super(App);
    function App() {
        return _class_call_check(this, App), _super.apply(this, arguments);
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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _create_super = require("@swc/helpers/lib/_create_super.js").default, _react = _interop_require_wildcard(require("react")), Button = function(_React_Component) {
    "use strict";
    _inherits(Button, _React_Component);
    var _super = _create_super(Button);
    function Button() {
        return _class_call_check(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return _react.createElement("button", null, "Some button");
    }, Button;
}(_react.Component);
