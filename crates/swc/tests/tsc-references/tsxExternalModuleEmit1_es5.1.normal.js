import * as swcHelpers from "@swc/helpers";
//@filename: app.tsx
import * as React from 'react';
//@filename: button.tsx
import * as React from 'react';
export var App = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(App, _Component);
    var _super = swcHelpers.createSuper(App);
    function App() {
        swcHelpers.classCallCheck(this, App);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(App, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement(Button, null));
            }
        }
    ]);
    return App;
}(React.Component);
export var Button = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        swcHelpers.classCallCheck(this, Button);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Button, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("button", null, "Some button"));
            }
        }
    ]);
    return Button;
}(React.Component);
