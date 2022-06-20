define([
    "require",
    "exports",
    "./get"
], function(require, exports, _get) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        byID: function() {
            return byID;
        },
        get: function() {
            return _get;
        }
    });
    _get = _interopRequireWildcard(_get);
    const byID = (id)=>{
        // Do some async stuff
        return new Promise((resolve)=>setTimeout(()=>{
                resolve("result");
            }, 2000));
    };
});
