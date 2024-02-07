//// [exportDeclaration.ts]
//// [/a.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/_/_class_call_check");
//// [/b.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), new (require("./a")).A();
//// [/c.ts]
module.exports = A;
//// [/d.ts]
var _a = require("./a");
module.exports = _a.A;
