define([
    "require",
    "exports",
    "@swc/helpers/_/_define_property",
    "@swc/helpers/_/_ts_decorate"
], function(require, exports, _define_property, _ts_decorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return _class;
        }
    });
    function state() {}
    class Controller {
    }
    var _class;
    _class = class _$class extends Controller {
        onChange() {}
        constructor(...args){
            super(...args);
            _define_property._(this, "isTest", false);
        }
    };
    _ts_decorate._([
        state
    ], _class.prototype, "isTest", void 0);
});
