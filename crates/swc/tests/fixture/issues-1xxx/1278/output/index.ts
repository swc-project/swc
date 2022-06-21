"use strict";
const _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
_tsDecorateMjs([
    MyDecorator(MyClass),
    _tsMetadataMjs("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
