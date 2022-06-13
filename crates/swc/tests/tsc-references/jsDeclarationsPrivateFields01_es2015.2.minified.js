import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export class C {
    getWorld() {
        return _class_private_field_get(this, _world);
    }
    constructor(){
        _class_private_method_init(this, _calcHello), _class_private_field_init(this, _screamingHello, {
            get: function() {
                return _class_private_field_get(this, _hello).toUpperCase();
            },
            set: function(value) {
                throw "NO";
            }
        }), _class_private_field_init(this, _hello, {
            writable: !0,
            value: "hello"
        }), _class_private_field_init(this, _world, {
            writable: !0,
            value: 100
        });
    }
}
