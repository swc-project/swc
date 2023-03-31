var _call_a, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    callA() {
        return _class_private_field_get(this, _a).call(this);
    }
    constructor(){
        _define_property(this, "value", 1);
        _class_private_field_init(this, _a, {
            writable: true,
            value: _call_a
        });
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        [_call_a, _initProto] = _applyDecs2203R(Foo, [
            [
                [
                    dec,
                    2,
                    "a",
                    function() {
                        return this.value;
                    }
                ]
            ]
        ], []).e;
    })()
};
