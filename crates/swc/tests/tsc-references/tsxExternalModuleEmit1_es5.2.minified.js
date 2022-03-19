import * as swcHelpers from "@swc/helpers";
import * as React from 'react';
import * as React from 'react';
export var App = function(_Component) {
    "use strict";
    swcHelpers.inherits(App, _Component);
    var _super = swcHelpers.createSuper(App);
    function App() {
        return swcHelpers.classCallCheck(this, App), _super.apply(this, arguments);
    }
    return App.prototype.render = function() {
        return React.createElement(Button, null);
    }, App;
}(React.Component);
export var Button = function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        return swcHelpers.classCallCheck(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement("button", null, "Some button");
    }, Button;
}(React.Component);
