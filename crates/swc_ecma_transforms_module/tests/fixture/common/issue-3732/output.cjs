// index.ts
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
    get: function() {
        return _get;
    },
    byID: function() {
        return byID;
    }
});
const _get = /*#__PURE__*/ _interop_require_wildcard(require("./get"));
const byID = (id)=>{
    // Do some async stuff
    return new Promise((resolve)=>setTimeout(()=>{
            resolve("result");
        }, 2000));
};
