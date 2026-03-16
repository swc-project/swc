{
    "class binding in plain class, decorated field, and computed keys";
    var _dec, _dec1, _computedKey, _init__computedKey, _init_extra__init__computedKey, _initProto;
    const errs = [];
    const fns = [];
    const capture = function(fn) {
        fns.push(fn);
        return ()=>{};
    };
    const assertUninitialized = function(fn) {
        try {
            fn();
        } catch (err) {
            errs.push(err);
        } finally{
            return ()=>{};
        }
    };
    capture(()=>K);
    assertUninitialized(()=>K);
    _dec = capture(()=>K), _dec1 = assertUninitialized(()=>K), _computedKey = (capture(()=>K), assertUninitialized(()=>K));
    let _computedKey1 = _computedKey;
    class K {
        constructor(){
            _define_property(this, _computedKey1, (_initProto(this), (()=>{
                const _value = _init__computedKey(this);
                _init_extra__init__computedKey(this);
                return _value;
            })()));
        }
    }
    ({ e: [_init__computedKey, _init_extra__init__computedKey, _initProto] } = _apply_decs_2311(K, [], [
        [
            [
                _dec,
                _dec1
            ],
            0,
            _computedKey
        ]
    ]));
    const E = ReferenceError;
    expect(errs.map((e)=>e.constructor)).toEqual([
        E,
        E,
        E
    ]);
    const C = K;
    // expect(fns.map(fn => fn())).toEqual([C, C, C]);
    // todo: remove these three and enable the assertions above when we properly handle class tdz
    expect(fns[0]()).toEqual(C);
    expect(fns[1]).toThrow(E);
    expect(fns[2]).toThrow(E);
    K = null;
    // expect(fns.map(fn => fn())).toEqual([null, C, C]);
    // todo: remove these three and enable the assertions above when we properly handle class tdz
    expect(fns[0]()).toEqual(null);
    expect(fns[1]).toThrow(E);
    expect(fns[2]).toThrow(E);
}{
    "class binding in decorated class, decorated field, and computed keys";
    var _dec2, _dec3, _initClass, _dec4, _computedKey1, //todo: add the assertUninitialized decorator when we properly implement class tdz
    _init__computedKey1, _init_extra__init__computedKey1, _initProto1;
    const errs = [];
    const fns = [];
    const capture = function(fn) {
        fns.push(fn);
        return ()=>{};
    };
    const assertUninitialized = function(fn) {
        try {
            fn();
        } catch (err) {
            errs.push(err);
        } finally{
            return ()=>{};
        }
    };
    let _K;
    _dec2 = capture(()=>_K), _dec3 = assertUninitialized(()=>_K), _dec4 = capture(()=>_K), _computedKey1 = capture(()=>_K);
    let _computedKey = _computedKey1;
    class K {
        constructor(){
            _define_property(this, _computedKey, (_initProto1(this), (()=>{
                const _value = _init__computedKey1(this);
                _init_extra__init__computedKey1(this);
                return _value;
            })()));
        }
    }
    ({ e: [_init__computedKey1, _init_extra__init__computedKey1, _initProto1], c: [_K, _initClass] } = _apply_decs_2311(K, [
        _dec2,
        _dec3
    ], [
        [
            _dec4,
            0,
            _computedKey1
        ]
    ]));
    _initClass();
    const E = ReferenceError;
    expect(errs.map((e)=>e.constructor)).toEqual([
        E
    ]);
    const C = _K;
    expect(fns.map((fn)=>fn())).toEqual([
        C,
        C,
        C
    ]);
    [_K = null] = [];
    expect(fns.map((fn)=>fn())).toEqual([
        null,
        C,
        C
    ]);
}{
    "class binding in decorated class, decorated static field, and computed keys";
    var _class;
    var _dec5, _dec6, _initClass1, _dec7, _computedKey2, //todo: add the assertUninitialized decorator when we properly implement class tdz
    _init__computedKey2, _init_extra__init__computedKey2, _initStatic;
    const errs = [];
    const fns = [];
    const capture = function(fn) {
        fns.push(fn);
        return ()=>{};
    };
    const assertUninitialized = function(fn) {
        try {
            fn();
        } catch (err) {
            errs.push(err);
        } finally{
            return ()=>{};
        }
    };
    let _K;
    _dec5 = capture(()=>_K), _dec6 = assertUninitialized(()=>_K), _dec7 = capture(()=>_K), _computedKey2 = capture(()=>_K);
    new (_class = class extends _identity {
        constructor(){
            super(_K), _initClass1();
        }
    }, (()=>{
        class K {
        }
        (()=>{
            ({ e: [_init__computedKey2, _init_extra__init__computedKey2, _initStatic], c: [_K, _initClass1] } = _apply_decs_2311(K, [
                _dec5,
                _dec6
            ], [
                [
                    _dec7,
                    8,
                    _computedKey2
                ]
            ]));
            _initStatic(K);
        })();
        _define_property(K, _computedKey2, (()=>{
            const _value = _init__computedKey2();
            _init_extra__init__computedKey2();
            return _value;
        })());
    })(), _class)();
    const E = ReferenceError;
    expect(errs.map((e)=>e.constructor)).toEqual([
        E
    ]);
    const C = _K;
    expect(fns.map((fn)=>fn())).toEqual([
        C,
        C,
        C
    ]);
    ({ K: _K = null } = {});
    expect(fns.map((fn)=>fn())).toEqual([
        null,
        C,
        C
    ]);
}{
    "class binding in decorated class, decorated static method, and computed keys with await";
    (async ()=>{
        var _class;
        var _dec, _dec1, _initClass, _dec2, _computedKey, _initStatic;
        const errs = [];
        const fns = [];
        const capture = function(fn) {
            fns.push(fn);
            return ()=>{};
        };
        const assertUninitialized = function(fn) {
            try {
                fn();
            } catch (err) {
                errs.push(err);
            } finally{
                return ()=>{};
            }
        };
        let _K;
        _dec = capture(await (()=>_K)), _dec1 = assertUninitialized(await (()=>_K)), _dec2 = capture(await (()=>_K)), _computedKey = capture(await (()=>_K));
        new (_class = class extends _identity {
            constructor(){
                super(_K), _initClass();
            }
        }, (()=>{
            let _computedKey1 = _computedKey;
            class K {
                //todo: add the assertUninitialized decorator when we properly implement class tdz
                static [_computedKey1]() {}
            }
            (()=>{
                ({ e: [_initStatic], c: [_K, _initClass] } = _apply_decs_2311(K, [
                    _dec,
                    _dec1
                ], [
                    [
                        _dec2,
                        10,
                        _computedKey
                    ]
                ]));
                _initStatic(K);
            })();
        })(), _class)();
        const E = ReferenceError;
        expect(errs.map((e)=>e.constructor)).toEqual([
            E
        ]);
        const C = _K;
        expect(fns.map((fn)=>fn())).toEqual([
            C,
            C,
            C
        ]);
        [_K] = [
            null
        ];
        expect(fns.map((fn)=>fn())).toEqual([
            null,
            C,
            C
        ]);
    })();
}
