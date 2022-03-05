import * as swcHelpers from "@swc/helpers";
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
// @target: esnext
// @allowJS: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: file.js
export class C {
    getWorld() {
        return swcHelpers.classPrivateFieldGet(this, _world);
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _calcHello);
        swcHelpers.classPrivateFieldInit(this, _screamingHello, {
            get: get_screamingHello,
            set: /** @param value {string} */ set_screamingHello
        });
        swcHelpers.classPrivateFieldInit(this, _hello, {
            writable: true,
            value: "hello"
        });
        swcHelpers.classPrivateFieldInit(this, _world, {
            writable: true,
            value: 100
        });
    }
}
function calcHello() {
    return swcHelpers.classPrivateFieldGet(this, _hello);
}
function get_screamingHello() {
    return swcHelpers.classPrivateFieldGet(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
