import * as swcHelpers from "@swc/helpers";
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export class C {
    getWorld() {
        return swcHelpers.classPrivateFieldGet(this, _world);
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _calcHello), swcHelpers.classPrivateFieldInit(this, _screamingHello, {
            get: function() {
                return swcHelpers.classPrivateFieldGet(this, _hello).toUpperCase();
            },
            set: function(value) {
                throw "NO";
            }
        }), swcHelpers.classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), swcHelpers.classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        });
    }
}
