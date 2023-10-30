"use strict";
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const Test = (version)=>{
    return (target)=>{
        target.version = version;
    };
};
var _default = Test;
