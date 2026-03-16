{
    var _init_foo, _init_extra__init_foo;
    let self, a, initCalled;
    function deco(_, context) {
        context.addInitializer(()=>{
            initCalled = true;
        });
    }
    class B {
        constructor(s){
            a = s;
        }
    }
    var ____private_foo_1 = /*#__PURE__*/ new WeakMap();
    class A extends B {
        get foo() {
            return _class_private_field_get(this, ____private_foo_1);
        }
        set foo(_v) {
            _class_private_field_set(this, ____private_foo_1, _v);
        }
        constructor(){
            let a = 2;
            self = [
                super(a),
                _class_private_field_init(this, ____private_foo_1, {
                    writable: true,
                    value: (()=>{
                        const _value = _init_foo(this, 42);
                        _init_extra__init_foo(this);
                        return _value;
                    })()
                })
            ][0];
        }
    }
    ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(A, [], [
        [
            deco,
            1,
            "foo"
        ]
    ]));
    let instance = new A();
    expect(self).toBe(instance);
    expect(a).toBe(2);
    expect(initCalled).toBe(true);
}{
    const dec = ({ get, set })=>{
        return {
            get () {
                return get.call(this) + 100;
            },
            set (v) {
                set.call(this, v);
            }
        };
    };
    class B {
        method() {
            return this.a;
        }
        constructor(v){
            this.a = v;
        }
    }
    {
        var _init_foo1, _init_extra__init_foo1;
        "super() nested within another constructor should not be transformed";
        let log = [];
        var ____private_foo_11 = /*#__PURE__*/ new WeakMap();
        class A extends B {
            get foo() {
                return _class_private_field_get(this, ____private_foo_11);
            }
            set foo(_v) {
                _class_private_field_set(this, ____private_foo_11, _v);
            }
            constructor(){
                log.push([
                    super(3),
                    _class_private_field_init(this, ____private_foo_11, {
                        writable: true,
                        value: (()=>{
                            const _value = _init_foo1(this, 42);
                            _init_extra__init_foo1(this);
                            return _value;
                        })()
                    })
                ][0].method());
                new class Dummy extends B {
                    constructor(){
                        log.push(super(4).method());
                    }
                }();
            }
        }
        ({ e: [_init_foo1, _init_extra__init_foo1] } = _apply_decs_2311(A, [], [
            [
                dec,
                1,
                "foo"
            ]
        ]));
        const a = new A();
        expect(log + "").toBe("3,4");
        expect(a.foo).toBe(142);
    }
    {
        "super() not in decorated derived constructor should not be transformed: computed key";
        let log = [];
        new class Dummy extends B {
            constructor(){
                var _computedKey, _init_foo, _init_extra__init_foo;
                let key;
                _computedKey = (key = super(5).method(), log.push(key), key);
                var ____private_foo_1 = /*#__PURE__*/ new WeakMap();
                let _computedKey1 = _computedKey;
                class A extends B {
                    get foo() {
                        return _class_private_field_get(this, ____private_foo_1);
                    }
                    set foo(_v) {
                        _class_private_field_set(this, ____private_foo_1, _v);
                    }
                    constructor(){
                        log.push([
                            super(6),
                            _class_private_field_init(this, ____private_foo_1, {
                                writable: true,
                                value: (()=>{
                                    const _value = _init_foo(this, 42);
                                    _init_extra__init_foo(this);
                                    return _value;
                                })()
                            }),
                            _define_property(this, _computedKey1, void 0)
                        ][0].method());
                    }
                }
                ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(A, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
                const a = new A();
                expect(a.foo).toBe(142);
            }
        }();
        expect(log + "").toBe("5,6");
    }
    {
        "super() in decorator expression within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        new class extends B {
            constructor(){
                var _dec, _init_foo, _init_extra__init_foo, _initProto;
                _dec = noop(log.push(super(7).method()));
                var ____private_foo_1 = /*#__PURE__*/ new WeakMap();
                class A extends B {
                    get foo() {
                        return _class_private_field_get(this, ____private_foo_1);
                    }
                    set foo(_v) {
                        _class_private_field_set(this, ____private_foo_1, _v);
                    }
                    noop() {}
                    constructor(){
                        log.push([
                            super(8),
                            _class_private_field_init(this, ____private_foo_1, {
                                writable: true,
                                value: (_initProto(this), (()=>{
                                    const _value = _init_foo(this, 42);
                                    _init_extra__init_foo(this);
                                    return _value;
                                })())
                            })
                        ][0].method());
                    }
                }
                ({ e: [_init_foo, _init_extra__init_foo, _initProto] } = _apply_decs_2311(A, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ],
                    [
                        _dec,
                        2,
                        "noop"
                    ]
                ]));
                const a = new A();
                expect(a.foo).toBe(142);
            }
        }();
        expect(log + "").toBe("7,8");
    }
    {
        var _init_foo2, _init_extra__init_foo2;
        "super() within decorated derived constructor should be transformed: computed key";
        let log = [];
        var ____private_foo_12 = /*#__PURE__*/ new WeakMap();
        class A extends B {
            get foo() {
                return _class_private_field_get(this, ____private_foo_12);
            }
            set foo(_v) {
                _class_private_field_set(this, ____private_foo_12, _v);
            }
            constructor(){
                let _computedKey;
                var _computedKey1;
                let key;
                _computedKey1 = (key = [
                    super(9),
                    _class_private_field_init(this, ____private_foo_12, {
                        writable: true,
                        value: (()=>{
                            const _value = _init_foo2(this, 42);
                            _init_extra__init_foo2(this);
                            return _value;
                        })()
                    })
                ][0].method(), log.push(key), key);
                new (_computedKey = _computedKey1, class Dummy extends B {
                    constructor(){
                        log.push([
                            super(10),
                            _define_property(this, _computedKey, void 0)
                        ][0].method());
                    }
                })();
            }
        }
        ({ e: [_init_foo2, _init_extra__init_foo2] } = _apply_decs_2311(A, [], [
            [
                dec,
                1,
                "foo"
            ]
        ]));
        const a = new A();
        expect(log + "").toBe("9,10");
        expect(a.foo).toBe(142);
    }
    {
        var _init_foo3, _init_extra__init_foo3;
        "super() within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        var ____private_foo_13 = /*#__PURE__*/ new WeakMap();
        class A extends B {
            get foo() {
                return _class_private_field_get(this, ____private_foo_13);
            }
            set foo(_v) {
                _class_private_field_set(this, ____private_foo_13, _v);
            }
            constructor(){
                var _Dummy;
                var _dec, _initProto;
                _dec = noop(log.push([
                    super(11),
                    _class_private_field_init(this, ____private_foo_13, {
                        writable: true,
                        value: (()=>{
                            const _value = _init_foo3(this, 42);
                            _init_extra__init_foo3(this);
                            return _value;
                        })()
                    })
                ][0].method()));
                new (_Dummy = class Dummy extends B {
                    noop() {}
                    constructor(){
                        log.push([
                            super(12),
                            _initProto(this)
                        ][0].method());
                    }
                }, { e: [_initProto] } = _apply_decs_2311(_Dummy, [], [
                    [
                        _dec,
                        2,
                        "noop"
                    ]
                ]), _Dummy)();
            }
        }
        ({ e: [_init_foo3, _init_extra__init_foo3] } = _apply_decs_2311(A, [], [
            [
                dec,
                1,
                "foo"
            ]
        ]));
        const a = new A();
        expect(log + "").toBe("11,12");
        expect(a.foo).toBe(142);
    }
}
