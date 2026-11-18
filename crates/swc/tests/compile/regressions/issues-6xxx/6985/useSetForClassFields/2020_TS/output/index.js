import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 1;
        _class_private_field_set(this, _b, 2);
    }
}
(()=>{
    Foo.c = 3;
})();
var _d = {
    writable: true,
    value: 4
};
