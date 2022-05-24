"use strict";
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
_ts_decorate([
    MyDecorator(MyClass),
    _ts_metadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
