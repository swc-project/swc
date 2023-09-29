// index.ts
"use strict";
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
const _get = require("./get");
const byID = (id)=>{
    // Do some async stuff
    return new Promise((resolve)=>setTimeout(()=>{
            resolve("result");
        }, 2000));
};
