function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export class A {
    constructor(){
        _used.set(this, {
            writable: true,
            value: "used"
        });
        _unused.set(this, {
            writable: true,
            value: "unused"
        });
        console.log(_classPrivateFieldGet(this, _used));
    }
}
var _used = new WeakMap();
var _unused = new WeakMap();
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        _used1.add(this);
        _unused1.add(this);
        console.log(_classPrivateMethodGet(this, _used1, used).call(this));
    }
}
function used() {}
function unused() {}
var _used2 = new WeakSet(), _used2 = new WeakSet(), _unused2 = new WeakSet(), _unused2 = new WeakSet();
export class A3 {
    constructor(){
        _used2.add(this);
        _used2.add(this);
        _unused2.add(this);
        _unused2.add(this);
        console.log(_classPrivateMethodGet(this, _used2, used1));
    }
}
function used1() {
    return 0;
}
function used1(value) {}
function unused1() {
    return 0;
}
function unused1(value) {}
