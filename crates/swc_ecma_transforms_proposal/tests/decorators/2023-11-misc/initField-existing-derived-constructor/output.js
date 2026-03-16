{
    let _init_foo, _init_extra__init_foo;
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
    class A extends B {
        static{
            ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(this, [], [
                [
                    deco,
                    1,
                    "foo"
                ]
            ]));
        }
        constructor(){
            let a = 2;
            self = super(a);
        }
        #___private_foo_1 = (()=>{
            const _value = _init_foo(this, 42);
            _init_extra__init_foo(this);
            return _value;
        })();
        get foo() {
            return this.#___private_foo_1;
        }
        set foo(_v) {
            this.#___private_foo_1 = _v;
        }
    }
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
        constructor(v){
            this.a = v;
        }
        method() {
            return this.a;
        }
    }
    {
        let _init_foo, _init_extra__init_foo;
        "super() nested within another constructor should not be transformed";
        let log = [];
        class A extends B {
            static{
                ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
            }
            constructor(){
                log.push(super(3).method());
                new class Dummy extends B {
                    constructor(){
                        log.push(super(4).method());
                    }
                }();
            }
            #___private_foo_1 = (()=>{
                const _value = _init_foo(this, 42);
                _init_extra__init_foo(this);
                return _value;
            })();
            get foo() {
                return this.#___private_foo_1;
            }
            set foo(_v) {
                this.#___private_foo_1 = _v;
            }
        }
        const a = new A();
        expect(log + "").toBe("3,4");
        expect(a.foo).toBe(142);
    }
    {
        "super() not in decorated derived constructor should not be transformed: computed key";
        let log = [];
        new class Dummy extends B {
            constructor(){
                let _computedKey, _init_foo, _init_extra__init_foo;
                let key;
                _computedKey = _to_property_key((key = super(5).method(), log.push(key), key));
                class A extends B {
                    static{
                        ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(this, [], [
                            [
                                dec,
                                1,
                                "foo"
                            ]
                        ]));
                    }
                    constructor(){
                        log.push(super(6).method());
                    }
                    #___private_foo_1 = (()=>{
                        const _value = _init_foo(this, 42);
                        _init_extra__init_foo(this);
                        return _value;
                    })();
                    get foo() {
                        return this.#___private_foo_1;
                    }
                    set foo(_v) {
                        this.#___private_foo_1 = _v;
                    }
                    [_computedKey];
                }
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
                let _dec, _init_foo, _init_extra__init_foo, _initProto;
                _dec = noop(log.push(super(7).method()));
                class A extends B {
                    static{
                        ({ e: [_init_foo, _init_extra__init_foo, _initProto] } = _apply_decs_2311(this, [], [
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
                    }
                    constructor(){
                        log.push(super(8).method());
                    }
                    #___private_foo_1 = (_initProto(this), (()=>{
                        const _value = _init_foo(this, 42);
                        _init_extra__init_foo(this);
                        return _value;
                    })());
                    get foo() {
                        return this.#___private_foo_1;
                    }
                    set foo(_v) {
                        this.#___private_foo_1 = _v;
                    }
                    noop() {}
                }
                const a = new A();
                expect(a.foo).toBe(142);
            }
        }();
        expect(log + "").toBe("7,8");
    }
    {
        let _init_foo, _init_extra__init_foo;
        "super() within decorated derived constructor should be transformed: computed key";
        let log = [];
        class A extends B {
            static{
                ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
            }
            constructor(){
                let _computedKey;
                let key;
                _computedKey = _to_property_key((key = super(9).method(), log.push(key), key));
                new class Dummy extends B {
                    constructor(){
                        log.push(super(10).method());
                    }
                    [_computedKey];
                }();
            }
            #___private_foo_1 = (()=>{
                const _value = _init_foo(this, 42);
                _init_extra__init_foo(this);
                return _value;
            })();
            get foo() {
                return this.#___private_foo_1;
            }
            set foo(_v) {
                this.#___private_foo_1 = _v;
            }
        }
        const a = new A();
        expect(log + "").toBe("9,10");
        expect(a.foo).toBe(142);
    }
    {
        let _init_foo, _init_extra__init_foo;
        "super() within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        class A extends B {
            static{
                ({ e: [_init_foo, _init_extra__init_foo] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
            }
            constructor(){
                let _dec, _initProto;
                _dec = noop(log.push(super(11).method()));
                new class Dummy extends B {
                    static{
                        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
                            [
                                _dec,
                                2,
                                "noop"
                            ]
                        ]));
                    }
                    constructor(){
                        log.push([
                            super(12),
                            _initProto(this)
                        ][0].method());
                    }
                    noop() {}
                }();
            }
            #___private_foo_1 = (()=>{
                const _value = _init_foo(this, 42);
                _init_extra__init_foo(this);
                return _value;
            })();
            get foo() {
                return this.#___private_foo_1;
            }
            set foo(_v) {
                this.#___private_foo_1 = _v;
            }
        }
        const a = new A();
        expect(log + "").toBe("11,12");
        expect(a.foo).toBe(142);
    }
}
