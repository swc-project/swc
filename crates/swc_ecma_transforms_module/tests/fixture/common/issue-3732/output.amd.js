// index.ts
define([
    "require",
    "exports",
    "./get"
], function(require, exports, _get) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        byID: function() {
            return byID;
        },
        get: function() {
            return _get;
        }
    });
    _get = /*#__PURE__*/ _interop_require_wildcard(_get);
    const byID = (id)=>{
        // Do some async stuff
        return new Promise((resolve)=>setTimeout(()=>{
                resolve("result");
            }, 2000));
    };
});
