"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
    constructor(){
        _defineProperty(this, "prop", void 0);
    }
}
_tsDecorate([
    MyDecorator(MyClass),
    _tsMetadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
