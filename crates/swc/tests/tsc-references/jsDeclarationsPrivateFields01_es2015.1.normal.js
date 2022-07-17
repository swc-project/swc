// @target: esnext
// @allowJS: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: file.js
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _hello = /*#__PURE__*/ new WeakMap(), _world = /*#__PURE__*/ new WeakMap(), _calcHello = /*#__PURE__*/ new WeakSet(), _screamingHello = /*#__PURE__*/ new WeakMap();
export class C {
    getWorld() {
        return _class_private_field_get(this, _world);
    }
    constructor(){
        _class_private_method_init(this, _calcHello);
        _class_private_field_init(this, _screamingHello, {
            get: get_screamingHello,
            set: /** @param value {string} */ set_screamingHello
        });
        _class_private_field_init(this, _hello, {
            writable: true,
            value: "hello"
        });
        _class_private_field_init(this, _world, {
            writable: true,
            value: 100
        });
    }
}
function calcHello() {
    return _class_private_field_get(this, _hello);
}
function get_screamingHello() {
    return _class_private_field_get(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
