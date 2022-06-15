"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export(exports, {
    byID: function() {
        return byID;
    },
    get: function() {
        return _get;
    }
});
var _get = _toESM(require("./get"));
const byID = (id)=>{
    // Do some async stuff
    return new Promise((resolve)=>setTimeout(()=>{
            resolve("result");
        }, 2000));
};
