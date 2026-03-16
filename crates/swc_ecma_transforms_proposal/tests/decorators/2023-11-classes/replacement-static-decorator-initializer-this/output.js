let _initClass, _dec, _dec1, _dec2, _dec3, _dec4, _init_accessor, _init_extra__init_accessor, _init_property, _init_extra__init_property, _initStatic;
let original, replaced, accessorThis, getterThis, setterThis, methodThis, propertyThis, classThis;
function dec(Klass, context) {
    original = Klass;
    replaced = class extends Klass {
    };
    context.addInitializer(function() {
        classThis = this;
    });
    return replaced;
}
function captureInitializerThis(callback) {
    return function(_, context) {
        context.addInitializer(function() {
            callback(this);
        });
    };
}
_dec = captureInitializerThis((v)=>accessorThis = v), _dec1 = captureInitializerThis((v)=>getterThis = v), _dec2 = captureInitializerThis((v)=>setterThis = v), _dec3 = captureInitializerThis((v)=>methodThis = v), _dec4 = captureInitializerThis((v)=>propertyThis = v);
let _Foo, _Foo_member;
new class extends _identity {
    constructor(){
        super(_Foo), _initClass(), _Foo_member = _Foo;
    }
    static [class Foo {
        static{
            ({ e: [_init_accessor, _init_extra__init_accessor, _init_property, _init_extra__init_property, _initStatic], c: [_Foo, _initClass] } = _apply_decs_2311(this, [
                dec
            ], [
                [
                    _dec,
                    9,
                    "accessor"
                ],
                [
                    _dec1,
                    11,
                    "getter"
                ],
                [
                    _dec2,
                    12,
                    "setter"
                ],
                [
                    _dec3,
                    10,
                    "method"
                ],
                [
                    _dec4,
                    8,
                    "property"
                ]
            ]));
            _initStatic(this);
        }
        static get accessor() {
            return Foo.#___private_accessor_1;
        }
        static set accessor(_v) {
            Foo.#___private_accessor_1 = _v;
        }
        static get getter() {}
        static set setter(_) {}
        static method() {}
    }];
    #___private_accessor_1 = (()=>{
        const _value = _init_accessor();
        _init_extra__init_accessor();
        return _value;
    })();
    property = (()=>{
        const _value = _init_property();
        _init_extra__init_property();
        return _value;
    })();
}();
