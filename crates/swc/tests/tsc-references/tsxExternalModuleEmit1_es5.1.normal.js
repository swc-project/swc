import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
//@filename: app.tsx
import * as React from "react";
//@filename: button.tsx
import * as React from "react";
export var App = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(App, _Component);
    var _super = _create_super(App);
    function App() {
        _class_call_check(this, App);
        return _super.apply(this, arguments);
    }
    var _proto = App.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(Button, null);
    };
    return App;
}(React.Component);
export var Button = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _create_super(Button);
    function Button() {
        _class_call_check(this, Button);
        return _super.apply(this, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("button", null, "Some button");
    };
    return Button;
}(React.Component);
