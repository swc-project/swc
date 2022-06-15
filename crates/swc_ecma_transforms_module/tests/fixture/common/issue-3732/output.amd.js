define([
    "require",
    "exports",
    "./get"
], function(require, _exports, _get) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _export(_exports, {
        byID: function() {
            return byID;
        },
        get: function() {
            return _get;
        }
    });
    _get = _toESM(_get);
    const byID = (id)=>{
        // Do some async stuff
        return new Promise((resolve)=>setTimeout(()=>{
                resolve("result");
            }, 2000));
    };
});
