{
    var _initProto;
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
            ({ e: [_initProto] } = _apply_decs_2311(this, [], [
                [
                    deco,
                    2,
                    "method"
                ]
            ]));
        }
        constructor(){
            let a = 2;
            self = [
                super(a),
                _initProto(this)
            ][0];
        }
        method() {}
    }
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
        constructor(v){
            this.a = v;
        }
        method() {
            return this.a;
        }
    }
    {
        var _initProto1;
        "super() nested within another constructor should not be transformed";
        let log = [];
        class A extends B {
            static{
                ({ e: [_initProto1] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        2,
                        "method"
                    ]
                ]));
            }
            constructor(){
                log.push([
                    super(3),
                    _initProto1(this)
                ][0].method());
                new class Dummy extends B {
                    constructor(){
                        log.push(super(4).method());
                    }
                }();
            }
            method() {
                return this.a;
            }
        }
        new A();
        expect(log + "").toBe("103,4");
    }
    {
        "super() not in decorated derived constructor should not be transformed: computed key";
        let log = [];
        new class Dummy extends B {
            constructor(){
                var _computedKey, _initProto;
                let key;
                _computedKey = (key = super(5).method(), log.push(key), key);
                class A extends B {
                    static{
                        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
                            [
                                dec,
                                2,
                                "method"
                            ]
                        ]));
                    }
                    constructor(){
                        log.push([
                            super(6),
                            _initProto(this)
                        ][0].method());
                    }
                    method() {
                        return this.a;
                    }
                    [_computedKey];
                }
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
                var _dec, _initProto;
                _dec = noop(log.push(super(7).method()));
                class A extends B {
                    static{
                        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
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
                    }
                    constructor(){
                        log.push([
                            super(8),
                            _initProto(this)
                        ][0].method());
                    }
                    method() {
                        return this.a;
                    }
                    noop() {}
                }
                new A();
            }
        }();
        expect(log + "").toBe("7,108");
    }
    {
        var _initProto2;
        "super() within decorated derived constructor should be transformed: computed key";
        let log = [];
        class A extends B {
            static{
                ({ e: [_initProto2] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        2,
                        "method"
                    ]
                ]));
            }
            constructor(){
                var _computedKey;
                let key;
                _computedKey = (key = [
                    super(9),
                    _initProto2(this)
                ][0].method(), log.push(key), key);
                new class Dummy extends B {
                    constructor(){
                        log.push(super(10).method());
                    }
                    [_computedKey];
                }();
            }
            method() {
                return this.a;
            }
        }
        new A();
        expect(log + "").toBe("109,10");
    }
    {
        var _initProto3;
        "super() within decorated derived constructor should be transformed: decorator expression";
        let log = [];
        const noop = ()=>(fn)=>fn;
        class A extends B {
            static{
                ({ e: [_initProto3] } = _apply_decs_2311(this, [], [
                    [
                        dec,
                        2,
                        "method"
                    ]
                ]));
            }
            constructor(){
                var _dec, _initProto;
                _dec = noop(log.push([
                    super(11),
                    _initProto3(this)
                ][0].method()));
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
            method() {
                return this.a;
            }
        }
        new A();
        expect(log + "").toBe("111,12");
    }
}
