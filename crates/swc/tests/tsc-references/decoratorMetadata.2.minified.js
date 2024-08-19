//// [service.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
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
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _interop_require_default = require("@swc/helpers/_/_interop_require_default"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_metadata = require("@swc/helpers/_/_ts_metadata"), _service = /*#__PURE__*/ _interop_require_default._(require("./service")), MyComponent = /*#__PURE__*/ function() {
    function MyComponent(Service) {
        _class_call_check._(this, MyComponent), this.Service = Service;
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
        void 0 === _service.default ? Object : _service.default
    ])
], MyComponent);
