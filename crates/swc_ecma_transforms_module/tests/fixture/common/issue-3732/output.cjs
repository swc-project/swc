"use strict";
var _exports = {};
__export(_exports, {
    byID: function() {
        return byID;
    },
    get: function() {
        return _get;
    }
});
module.exports = __toCJS(_exports);
var _get = __toESM(require("./get"));
const byID = (id)=>{
    // Do some async stuff
    return new Promise((resolve)=>setTimeout(()=>{
            resolve("result");
        }, 2000));
};
