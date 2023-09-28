var _dec, _initClass, _dec1, _dec2, _dec3, _dec4, _initProto;
let _Foo;
_dec = ()=>decorate(), _dec1 = ()=>decorate(), _dec2 = ()=>decorate(), _dec3 = ()=>_dec1(), _dec4 = ()=>_dec2();
class Foo {
    static{
        ({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2203_r(this, [
            [
                _dec3(),
                3,
                "name"
            ],
            [
                _dec4(),
                2,
                "sayHi"
            ]
        ], [
            _dec()
        ]));
    }
    constructor(){
        _initProto(this);
    }
    get name() {
        return "hello";
    }
    sayHi() {
        return "hello";
    }
    static{
        _initClass();
    }
}
function decorate() {
    return function(target, { kind }) {
        console.log(target, kind);
    };
}
export { _Foo as Foo };
