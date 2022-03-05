import * as swcHelpers from "@swc/helpers";
var _used = new WeakMap(), _unused = new WeakMap();
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _used, {
            writable: true,
            value: "used"
        });
        swcHelpers.classPrivateFieldInit(this, _unused, {
            writable: true,
            value: "unused"
        });
        console.log(swcHelpers.classPrivateFieldGet(this, _used));
    }
}
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _used1);
        swcHelpers.classPrivateMethodInit(this, _unused1);
        console.log(swcHelpers.classPrivateMethodGet(this, _used1, used).call(this));
    }
}
function used() {}
function unused() {}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export class A3 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _used2, {
            get: get_used,
            set: set_used
        });
        swcHelpers.classPrivateFieldInit(this, _unused2, {
            get: get_unused,
            set: set_unused
        });
        console.log(swcHelpers.classPrivateFieldGet(this, _used2));
    }
}
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
