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
    fn: function() {
        return fn;
    }
});
var _something = require("something");
const fn = ({ a =new _something.Foo()  })=>a;
