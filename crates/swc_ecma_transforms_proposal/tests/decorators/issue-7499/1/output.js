var _computedKey, _initProto;
class Tests {
    static{
        _computedKey = 'computed';
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                test,
                2,
                _computedKey
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    [_computedKey]() {}
    id() {
        class Bar {
        }
    }
}
function test(fn) {
    return fn;
}
let t = new Tests();
t.id();
