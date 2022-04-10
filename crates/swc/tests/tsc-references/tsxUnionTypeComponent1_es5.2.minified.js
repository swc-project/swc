import * as swcHelpers from "@swc/helpers";
var React = require("react"), MyComponent = function(_Component) {
    swcHelpers.inherits(MyComponent, _Component);
    var _super = swcHelpers.createSuper(MyComponent);
    function MyComponent() {
        return swcHelpers.classCallCheck(this, MyComponent), _super.apply(this, arguments);
    }
    return MyComponent.prototype.render = function() {
        var AnyComponent = this.props.AnyComponent;
        return React.createElement(AnyComponent, null);
    }, MyComponent;
}(React.Component), MyButtonComponent = function(_Component) {
    swcHelpers.inherits(MyButtonComponent, _Component);
    var _super = swcHelpers.createSuper(MyButtonComponent);
    function MyButtonComponent() {
        return swcHelpers.classCallCheck(this, MyButtonComponent), _super.apply(this, arguments);
    }
    return MyButtonComponent;
}(React.Component);
