{
    "class binding in plain class, decorated field, and computed keys";
    let _dec, _dec1, _computedKey, _init__computedKey, _init_extra__init__computedKey;
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
    class K {
        static [(_dec = capture(()=>K), _dec1 = assertUninitialized(()=>K), _computedKey = _to_property_key((capture(()=>K), assertUninitialized(()=>K))), "_")]() {}
        static #_ = { e: [_init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(this, [], [
            [
                [
                    _dec,
                    _dec1
                ],
                0,
                _computedKey
            ]
        ]);
        constructor(){
            _init_extra__init__computedKey(this);
        }
        [_computedKey] = _init__computedKey(this);
    }
    const E = ReferenceError;
    expect(errs.map((e)=>e.constructor)).toEqual([
        E,
        E,
        E
    ]);
    const C = K;
    expect(fns.map((fn)=>fn())).toEqual([
        C,
        C,
        C
    ]);
    K = null;
    expect(fns.map((fn)=>fn())).toEqual([
        null,
        C,
        C
    ]);
}{
    "class binding in decorated class, decorated field, and computed keys";
    let _dec, _dec1, _initClass, _dec2, _computedKey, //todo: add the assertUninitialized decorator when we properly implement class tdz
    _init__computedKey, _init_extra__init__computedKey;
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
    _dec = capture(()=>_K), _dec1 = assertUninitialized(()=>_K), _dec2 = capture(()=>_K_member), _computedKey = _to_property_key(capture(()=>_K_member));
    let _K, _K_member;
    class K {
        static #_ = { e: [_init__computedKey, _init_extra__init__computedKey], c: [_K, _initClass] } = _apply_decs_2311(this, [
            _dec,
            _dec1
        ], [
            [
                _dec2,
                0,
                _computedKey
            ]
        ]);
        constructor(){
            _init_extra__init__computedKey(this);
        }
        [_computedKey] = _init__computedKey(this);
        static #_2 = (()=>{
            _initClass();
            _K_member = _K;
        })();
    }
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
    let _dec, _dec1, _initClass, _dec2, _computedKey, //todo: add the assertUninitialized decorator when we properly implement class tdz
    _init__computedKey, _init_extra__init__computedKey;
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
    _dec = capture(()=>_K), _dec1 = assertUninitialized(()=>_K), _dec2 = capture(()=>_K_member), _computedKey = _to_property_key(capture(()=>_K_member));
    let _K, _K_member;
    new class extends _identity {
        constructor(){
            super(_K), _initClass(), _K_member = _K;
        }
        static [class K {
            static #_ = { e: [_init__computedKey, _init_extra__init__computedKey], c: [_K, _initClass] } = _apply_decs_2311(this, [
                _dec,
                _dec1
            ], [
                [
                    _dec2,
                    8,
                    _computedKey
                ]
            ]);
        }];
        [_computedKey] = (()=>{
            const _value = _init__computedKey();
            _init_extra__init__computedKey();
            return _value;
        })();
    }();
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
        let _dec, _dec1, _initClass, _dec2, _computedKey, _initStatic;
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
        _dec = capture(await (()=>_K)), _dec1 = assertUninitialized(await (()=>_K)), _dec2 = capture(await (()=>_K_member)), _computedKey = _to_property_key(capture(await (()=>_K_member)));
        let _K, _K_member;
        new class extends _identity {
            constructor(){
                super(_K), _initClass(), _K_member = _K;
            }
            static [class K {
                static #_ = (()=>{
                    ({ e: [_initStatic], c: [_K, _initClass] } = _apply_decs_2311(this, [
                        _dec,
                        _dec1
                    ], [
                        [
                            _dec2,
                            10,
                            _computedKey
                        ]
                    ]));
                    _initStatic(this);
                })();
                //todo: add the assertUninitialized decorator when we properly implement class tdz
                static [_computedKey]() {}
            }];
        }();
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
