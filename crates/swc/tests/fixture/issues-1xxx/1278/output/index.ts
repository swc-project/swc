"use strict";
var swcHelpers = require("@swc/helpers");
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
swcHelpers.__decorate([
    MyDecorator(MyClass),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
