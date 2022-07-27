//@jsx: preserve
//@module: commonjs
//@filename: react.d.ts
//@filename: app.tsx
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
// Should see var button_1 = require('./button') here
import { Button } from "./button";
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
//@filename: button.tsx
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
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
