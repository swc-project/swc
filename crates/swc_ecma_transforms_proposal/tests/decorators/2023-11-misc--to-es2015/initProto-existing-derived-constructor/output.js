{
    let _initProto;
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
        method() {}
        constructor(){
            let a = 2;
            self = [
                super(a),
                _initProto(this)
            ][0];
        }
    }
    ({ e: [_initProto] } = _apply_decs_2311(A, [], [
        [
            deco,
            2,
            "method"
        ]
    ]));
    let instance = new A();
    expect(self).toBe(instance);
    expect(a).toBe(2);
    expect(initCalled).toBe(true);
}{
    const dec = (fn)=>{
        return function() {
            return fn.call(this) + 100;
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
        let _initProto;
        "super() nested within another constructor should not be transformed";
        let log = [];
        class A extends B {
            method() {
                return this.a;
            }
            constructor(){
                log.push([
                    super(3),
                    _initProto(this)
                ][0].method());
                new class Dummy extends B {
                    constructor(){
                        log.push(super(4).method());
                    }
                }();
            }
        }
        ({ e: [_initProto] } = _apply_decs_2311(A, [], [
            [
                dec,
                2,
                "method"
            ]
        ]));
        new A();
        expect(log + "").toBe("103,4");
    }
    {
        "super() not in decorated derived constructor should not be transformed: computed key";
        let log = [];
        new class Dummy extends B {
            constructor(){
                let _computedKey, _initProto;
                let key;
                _computedKey = _to_property_key((key = super(5).method(), log.push(key), key));
                let _computedKey1 = _computedKey;
                class A extends B {
                    method() {
                        return this.a;
                    }
                    constructor(){
                        log.push([
                            [
                                super(6),
                                _define_property(this, _computedKey1, void 0)
                            ][0],
                            _initProto(this)
                        ][0].method());
                    }
                }
                ({ e: [_initProto] } = _apply_decs_2311(A, [], [
                    [
                        dec,
                        2,
                        "method"
                    ]
                ]));
                new A();
            }
        }();
        expect(log + "").toBe("5,106");
    }
    {
        "super() in decorator expression within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        new class extends B {
            constructor(){
                let _dec, _initProto;
                _dec = noop(log.push(super(7).method()));
                class A extends B {
                    method() {
                        return this.a;
                    }
                    noop() {}
                    constructor(){
                        log.push([
                            super(8),
                            _initProto(this)
                        ][0].method());
                    }
                }
                ({ e: [_initProto] } = _apply_decs_2311(A, [], [
                    [
                        dec,
                        2,
                        "method"
                    ],
                    [
                        _dec,
                        2,
                        "noop"
                    ]
                ]));
                new A();
            }
        }();
        expect(log + "").toBe("7,108");
    }
    {
        let _initProto;
        "super() within decorated derived constructor should be transformed: computed key";
        let log = [];
        class A extends B {
            method() {
                return this.a;
            }
            constructor(){
                let _computedKey;
                let _computedKey1;
                let key;
                _computedKey1 = _to_property_key((key = [
                    super(9),
                    _initProto(this)
                ][0].method(), log.push(key), key));
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
        ({ e: [_initProto] } = _apply_decs_2311(A, [], [
            [
                dec,
                2,
                "method"
            ]
        ]));
        new A();
        expect(log + "").toBe("109,10");
    }
    {
        let _initProto;
        "super() within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        class A extends B {
            method() {
                return this.a;
            }
            constructor(){
                var _Dummy;
                let _dec, _initProto1;
                _dec = noop(log.push([
                    super(11),
                    _initProto(this)
                ][0].method()));
                new (_Dummy = class Dummy extends B {
                    noop() {}
                    constructor(){
                        log.push([
                            super(12),
                            _initProto1(this)
                        ][0].method());
                    }
                }, { e: [_initProto1] } = _apply_decs_2311(_Dummy, [], [
                    [
                        _dec,
                        2,
                        "noop"
                    ]
                ]), _Dummy)();
            }
        }
        ({ e: [_initProto] } = _apply_decs_2311(A, [], [
            [
                dec,
                2,
                "method"
            ]
        ]));
        new A();
        expect(log + "").toBe("111,12");
    }
}
