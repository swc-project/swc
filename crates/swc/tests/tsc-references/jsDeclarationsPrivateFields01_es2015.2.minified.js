var _calcHello = new WeakSet(), _screamingHello = new WeakSet(), _screamingHello = new WeakSet();
export class C {
    getWorld() {
        return (function(receiver, privateMap) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver).value;
        })(this, _world);
    }
    constructor(){
        _hello.set(this, {
            writable: !0,
            value: "hello"
        }), _world.set(this, {
            writable: !0,
            value: 100
        }), _calcHello.add(this), _screamingHello.add(this), _screamingHello.add(this);
    }
}
var _hello = new WeakMap(), _world = new WeakMap();
