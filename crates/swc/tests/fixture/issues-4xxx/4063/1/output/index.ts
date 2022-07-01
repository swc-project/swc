define([
    "require",
    "exports",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_class
    });
    _tsDecorate = _tsDecorate.default;
    function state() {}
    class Controller {
    }
    class _class extends Controller {
        onChange() {}
        constructor(...args){
            super(...args);
            this.isTest = false;
        }
    }
    _tsDecorate([
        state
    ], _class.prototype, "isTest", void 0);
});
