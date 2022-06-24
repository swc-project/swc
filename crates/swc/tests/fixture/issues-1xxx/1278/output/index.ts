"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
_tsDecorate([
    MyDecorator(MyClass),
    _tsMetadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
