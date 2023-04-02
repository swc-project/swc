//// [tsxAttributeResolution10.tsx]
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
], function(require, exports, _class_call_check) {
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
    _class_call_check = _class_call_check.default;
    var MyComponent = /*#__PURE__*/ function() {
        "use strict";
        function MyComponent() {
            _class_call_check(this, MyComponent);
        }
        var _proto = MyComponent.prototype;
        _proto.render = function render() {};
        return MyComponent;
    }();
    // Should be an error
    /*#__PURE__*/ React.createElement(MyComponent, {
        bar: "world"
    });
    // Should be OK
    /*#__PURE__*/ React.createElement(MyComponent, {
        bar: true
    });
    // Should be ok
    /*#__PURE__*/ React.createElement(MyComponent, {
        "data-bar": "hello"
    });
});
