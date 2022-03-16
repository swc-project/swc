import * as swcHelpers from "@swc/helpers";
var _bar, _class;
// @target: es2015
const C = (_bar = /*#__PURE__*/ new WeakSet(), _class = class {
    foo() {
        swcHelpers.classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _bar);
    }
}, _class);
console.log(new C().foo());
function bar() {}
