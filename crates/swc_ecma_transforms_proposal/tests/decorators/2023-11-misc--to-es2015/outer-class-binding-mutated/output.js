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
    let _tmp = (_dec = capture(()=>(_class_name_tdz_error("K"), K)), _dec1 = assertUninitialized(()=>(_class_name_tdz_error("K"), K)), _computedKey = _to_property_key((capture(()=>(_class_name_tdz_error("K"), K)), assertUninitialized(()=>(_class_name_tdz_error("K"), K)))), "_"), _computedKey1 = _computedKey;
    class K {
        static [_tmp]() {}
        constructor(){
            _define_property(this, _computedKey1, _init__computedKey(this));
            _init_extra__init__computedKey(this);
        }
    }
    ({ e: [_init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(K, [], [
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
    let _computedKey1 = _computedKey;
    class K {
        constructor(){
            _define_property(this, _computedKey1, _init__computedKey(this));
            _init_extra__init__computedKey(this);
        }
    }
    ({ e: [_init__computedKey, _init_extra__init__computedKey], c: [_K, _initClass] } = _apply_decs_2311(K, [
        _dec,
        _dec1
    ], [
        [
            _dec2,
            0,
            _computedKey
        ]
    ]));
    (()=>{
        _initClass();
        _K_member = _K;
    })();
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
    let _ref, _computedKey;
    var _K, _class;
    let _dec, _dec1, _initClass, _dec2, _computedKey1, //todo: add the assertUninitialized decorator when we properly implement class tdz
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
    _dec = capture(()=>_K1), _dec1 = assertUninitialized(()=>_K1), _dec2 = capture(()=>_K_member), _computedKey1 = _to_property_key(capture(()=>_K_member));
    let _K1, _K_member;
    new (_ref = (_K = class K {
    }, { e: [_init__computedKey, _init_extra__init__computedKey], c: [_K1, _initClass] } = _apply_decs_2311(_K, [
        _dec,
        _dec1
    ], [
        [
            _dec2,
            8,
            _computedKey1
        ]
    ]), _K), _computedKey = _computedKey1, _class = class extends _identity {
        constructor(){
            super(_K1), _define_property(this, _computedKey, (()=>{
                const _value = _init__computedKey();
                _init_extra__init__computedKey();
                return _value;
            })()), _initClass(), _K_member = _K1;
        }
    }, _define_property(_class, _ref, void 0), _class)();
    const E = ReferenceError;
    expect(errs.map((e)=>e.constructor)).toEqual([
        E
    ]);
    const C = _K1;
    expect(fns.map((fn)=>fn())).toEqual([
        C,
        C,
        C
    ]);
    ({ K: _K1 = null } = {});
    expect(fns.map((fn)=>fn())).toEqual([
        null,
        C,
        C
    ]);
}{
    "class binding in decorated class, decorated static method, and computed keys with await";
    (async ()=>{
        let _computedKey, _ref;
        var _K, _class;
        let _dec, _dec1, _initClass, _dec2, _computedKey1, _initStatic;
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
        _dec = capture(await (()=>_K1)), _dec1 = assertUninitialized(await (()=>_K1)), _dec2 = capture(await (()=>_K_member)), _computedKey1 = _to_property_key(capture(await (()=>_K_member)));
        let _K1, _K_member;
        new (_ref = (_computedKey = _computedKey1, _K = class K {
            //todo: add the assertUninitialized decorator when we properly implement class tdz
            static [_computedKey]() {}
        }, (()=>{
            ({ e: [_initStatic], c: [_K1, _initClass] } = _apply_decs_2311(_K, [
                _dec,
                _dec1
            ], [
                [
                    _dec2,
                    10,
                    _computedKey1
                ]
            ]));
            _initStatic(_K);
        })(), _K), _class = class extends _identity {
            constructor(){
                super(_K1), _initClass(), _K_member = _K1;
            }
        }, _define_property(_class, _ref, void 0), _class)();
        const E = ReferenceError;
        expect(errs.map((e)=>e.constructor)).toEqual([
            E
        ]);
        const C = _K1;
        expect(fns.map((fn)=>fn())).toEqual([
            C,
            C,
            C
        ]);
        [_K1] = [
            null
        ];
        expect(fns.map((fn)=>fn())).toEqual([
            null,
            C,
            C
        ]);
    })();
}
