//// [tsxAttributeResolution9.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "MyComponent", {
        enumerable: true,
        get: function() {
            return MyComponent;
        }
    });
    _classCallCheck = _classCallCheck.default;
    var MyComponent = /*#__PURE__*/ function() {
        "use strict";
        function MyComponent() {
            _classCallCheck(this, MyComponent);
        }
        var _proto = MyComponent.prototype;
        _proto.render = function render() {};
        return MyComponent;
    }();
    /*#__PURE__*/ React.createElement(MyComponent, {
        foo: "bar"
    }); // ok  
    /*#__PURE__*/ React.createElement(MyComponent, {
        foo: 0
    }); // should be an error
});
