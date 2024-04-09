export function test() {
    var _dec, _initClass, _dec1, _dec2, _initProto;
    let _Foo;
    _dec = decorate(), _dec1 = decorate(), _dec2 = decorate();
    // try putting this in stmts instead of at the top level
    class Foo {
        static{
            ({ e: [_initProto], c: [_Foo, _initClass] } = _apply_decs_2203_r(this, [
                [
                    _dec1,
                    3,
                    "name"
                ],
                [
                    _dec2,
                    2,
                    "sayHi"
                ]
            ], [
                _dec
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
    return new _Foo();
}
