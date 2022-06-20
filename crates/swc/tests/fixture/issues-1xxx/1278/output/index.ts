"use strict";
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
(0, _tsDecorateMjs.default)([
    MyDecorator(MyClass),
    (0, _tsMetadataMjs.default)("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
