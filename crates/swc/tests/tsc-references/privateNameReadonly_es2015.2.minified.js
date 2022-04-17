var _bar;
import * as swcHelpers from "@swc/helpers";
let C = (_bar = new WeakSet(), class {
    foo() {
        swcHelpers.classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _bar);
    }
});
console.log(new C().foo());
