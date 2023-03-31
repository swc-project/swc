define([
    "require",
    "exports",
    "@swc/helpers/src/_define_property.mjs",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _define_property, _ts_decorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_class
    });
    _define_property = _define_property.default;
    _ts_decorate = _ts_decorate.default;
    function state() {}
    class Controller {
    }
    class _class extends Controller {
        onChange() {}
        constructor(...args){
            super(...args);
            _define_property(this, "isTest", false);
        }
    }
    _ts_decorate([
        state
    ], _class.prototype, "isTest", void 0);
});
