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
        var _init_foo1, _init_extra__init_foo1;
        "super() nested within another constructor should not be transformed";
        let log = [];
        class A extends B {
            static{
                ({ e: [_init_foo1, _init_extra__init_foo1] } = _apply_decs_2311(this, [], [
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
                const _value = _init_foo1(this, 42);
                _init_extra__init_foo1(this);
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
                var _computedKey, _init_foo, _init_extra__init_foo;
                let key;
                _computedKey = (key = super(5).method(), log.push(key), key);
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
                var _dec, _init_foo, _init_extra__init_foo, _initProto;
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
        var _init_foo2, _init_extra__init_foo2;
        "super() within decorated derived constructor should be transformed: computed key";
        let log = [];
        class A extends B {
            static{
                ({ e: [_init_foo2, _init_extra__init_foo2] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
            }
            constructor(){
                var _computedKey;
                let key;
                _computedKey = (key = super(9).method(), log.push(key), key);
                new class Dummy extends B {
                    constructor(){
                        log.push(super(10).method());
                    }
                    [_computedKey];
                }();
            }
            #___private_foo_1 = (()=>{
                const _value = _init_foo2(this, 42);
                _init_extra__init_foo2(this);
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
        var _init_foo3, _init_extra__init_foo3;
        "super() within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        class A extends B {
            static{
                ({ e: [_init_foo3, _init_extra__init_foo3] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        1,
                        "foo"
                    ]
                ]));
            }
            constructor(){
                var _dec, _initProto;
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
                const _value = _init_foo3(this, 42);
                _init_extra__init_foo3(this);
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
