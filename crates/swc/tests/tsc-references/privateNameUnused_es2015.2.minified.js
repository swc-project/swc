import * as swcHelpers from "@swc/helpers";
var _used = new WeakMap(), _unused = new WeakMap();
export class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _used, {
            writable: !0,
            value: "used"
        }), swcHelpers.classPrivateFieldInit(this, _unused, {
            writable: !0,
            value: "unused"
        }), console.log(swcHelpers.classPrivateFieldGet(this, _used));
    }
}
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _used1), swcHelpers.classPrivateMethodInit(this, _unused1), console.log(swcHelpers.classPrivateMethodGet(this, _used1, function() {}).call(this));
    }
}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export class A3 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _used2, {
            get: function() {
                return 0;
            },
            set: function(value) {}
        }), swcHelpers.classPrivateFieldInit(this, _unused2, {
            get: function() {
                return 0;
            },
            set: function(value) {}
        }), console.log(swcHelpers.classPrivateFieldGet(this, _used2));
    }
}
