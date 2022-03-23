"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.byID = exports.get = void 0;
var _get = _interopRequireWildcard(require("./get"));
exports.get = _get;
const byID = (id)=>{
    // Do some async stuff
    return new Promise((resolve)=>setTimeout(()=>{
            resolve("result");
        }, 2000)
    );
};
exports.byID = byID;
