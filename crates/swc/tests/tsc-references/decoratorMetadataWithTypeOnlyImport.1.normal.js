//// [service.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Service", {
    enumerable: true,
    get: function() {
        return Service;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var Service = function Service() {
    "use strict";
    _class_call_check._(this, Service);
};
//// [component.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var MyComponent = /*#__PURE__*/ function() {
    "use strict";
    function MyComponent(Service1) {
        _class_call_check._(this, MyComponent);
        this.Service = Service1;
    }
    var _proto = MyComponent.prototype;
    _proto.method = function method(x) {};
    return MyComponent;
}();
_ts_decorate._([
    decorator,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Object
    ]),
    _ts_metadata._("design:returntype", void 0)
], MyComponent.prototype, "method", null);
MyComponent = _ts_decorate._([
    decorator,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof Service === "undefined" ? Object : Service
    ])
], MyComponent);
