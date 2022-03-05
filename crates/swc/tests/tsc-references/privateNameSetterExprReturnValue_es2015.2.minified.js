import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
new class {
    bar() {
        let x = swcHelpers.classPrivateFieldSet(this, _foo, 84);
        console.log(x);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            get: void 0,
            set: function(a) {}
        });
    }
}().bar();
