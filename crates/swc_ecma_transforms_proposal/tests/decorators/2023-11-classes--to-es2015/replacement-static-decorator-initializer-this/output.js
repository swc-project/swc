let _ref;
var _Foo, ____private_accessor_1, _class;
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
let _Foo1, _Foo_member;
new (____private_accessor_1 = /*#__PURE__*/ new WeakMap(), _ref = (_Foo = class Foo {
    static get accessor() {
        return _class_private_field_get(Foo, ____private_accessor_1);
    }
    static set accessor(_v) {
        _class_private_field_set(Foo, ____private_accessor_1, _v);
    }
    static get getter() {}
    static set setter(_) {}
    static method() {}
}, (()=>{
    ({ e: [_init_accessor, _init_extra__init_accessor, _init_property, _init_extra__init_property, _initStatic], c: [_Foo1, _initClass] } = _apply_decs_2311(_Foo, [
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
    _initStatic(_Foo);
})(), _Foo), _class = class extends _identity {
    constructor(){
        super(_Foo1), _class_private_field_init(this, ____private_accessor_1, {
            writable: true,
            value: (()=>{
                const _value = _init_accessor();
                _init_extra__init_accessor();
                return _value;
            })()
        }), _define_property(this, "property", (()=>{
            const _value = _init_property();
            _init_extra__init_property();
            return _value;
        })()), _initClass(), _Foo_member = _Foo1;
    }
}, _define_property(_class, _ref, void 0), _class)();
