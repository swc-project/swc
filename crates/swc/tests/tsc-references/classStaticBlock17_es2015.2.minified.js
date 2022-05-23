import * as swcHelpers from "@swc/helpers";
let friendA;
var _x = new WeakMap();
friendA = {
    getX: (obj)=>swcHelpers.classPrivateFieldGet(obj, _x),
    setX (obj, value) {
        swcHelpers.classPrivateFieldSet(obj, _x, value);
    }
};
let a = new class {
    getX() {
        return swcHelpers.classPrivateFieldGet(this, _x);
    }
    constructor(v){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _x, v);
    }
}(41);
new class {
    constructor(a1){
        let x = friendA.getX(a1);
        friendA.setX(a1, x + 1);
    }
}(a), a.getX();
