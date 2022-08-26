import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
import { Button } from "./button";
export var App = function(_Component) {
    "use strict";
    _inherits(App, _Component);
    var _super = _create_super(App);
    function App() {
        return _class_call_check(this, App), _super.apply(this, arguments);
    }
    var _proto = App.prototype;
    return _proto.render = function() {
        return React.createElement(Button, null);
    }, App;
}(React.Component);
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
export var Button = function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _create_super(Button);
    function Button() {
        return _class_call_check(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement("button", null, "Some button");
    }, Button;
}(React.Component);
