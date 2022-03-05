import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var MyComponent = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(MyComponent, _Component);
    var _super = swcHelpers.createSuper(MyComponent);
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(MyComponent, [
        {
            key: "render",
            value: function render() {
                var AnyComponent = this.props.AnyComponent;
                return(/*#__PURE__*/ React.createElement(AnyComponent, null));
            }
        }
    ]);
    return MyComponent;
}(React.Component);
// Stateless Component As Props
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: function() {
        /*#__PURE__*/ return React.createElement("button", null, "test");
    }
});
var MyButtonComponent = // Component Class as Props
/*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(MyButtonComponent, _Component);
    var _super = swcHelpers.createSuper(MyButtonComponent);
    function MyButtonComponent() {
        swcHelpers.classCallCheck(this, MyButtonComponent);
        return _super.apply(this, arguments);
    }
    return MyButtonComponent;
}(React.Component);
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };
