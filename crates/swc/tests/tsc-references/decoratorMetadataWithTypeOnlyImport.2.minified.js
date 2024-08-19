//// [service.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Service", {
    enumerable: !0,
    get: function() {
        return Service;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), Service = function Service() {
    _class_call_check._(this, Service);
};
//// [component.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_metadata = require("@swc/helpers/_/_ts_metadata"), MyComponent = /*#__PURE__*/ function() {
    function MyComponent(Service1) {
        _class_call_check._(this, MyComponent), this.Service = Service1;
    }
    return MyComponent.prototype.method = function(x) {}, MyComponent;
}();
_ts_decorate._([
    decorator,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Object
    ]),
    _ts_metadata._("design:returntype", void 0)
], MyComponent.prototype, "method", null), _ts_decorate._([
    decorator,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        "undefined" == typeof Service ? Object : Service
    ])
], MyComponent);
