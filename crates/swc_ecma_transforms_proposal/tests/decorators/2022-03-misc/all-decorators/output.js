function applyDecs2203RFactory() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        if (kind !== 0) {
            ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        }
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                if (kind !== 0) {
                    staticInitializers = staticInitializers || [];
                    initializers = staticInitializers;
                }
            } else {
                base = Class.prototype;
                if (kind !== 0) {
                    protoInitializers = protoInitializers || [];
                    initializers = protoInitializers;
                }
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || (existingKind === 3 && kind !== 4) || (existingKind === 4 && kind !== 3)) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r = applyDecs2203RFactory())(targetClass, memberDecs, classDecs, parentClass);
}
function _identity(x) {
    return x;
}
var _initClass, _init_d, _call_f, _call_g, _call_g1, _init_h, _get___h, _set___h, _init_m, _call_o, _call_p, _call_q, _init_r, _get___r, _set___r, _init_a, _init_e, _init_i, _init_n, _initProto, _initStatic;
const dec = ()=>{};
let _Class;
new class extends _identity {
    constructor(){
        super(Class), _initClass();
    }
    static{
        class Class1 {
            static{
                ({ e: [_init_m, _call_o, _call_p, _call_q, _init_r, _get___r, _set___r, _init_i, _init_n, _init_d, _call_f, _call_g, _call_g1, _init_h, _get___h, _set___h, _init_a, _init_e, _initProto, _initStatic], c: [_Class, _initClass] } = _apply_decs_2203_r(this, [
                    [
                        dec,
                        7,
                        "j"
                    ],
                    [
                        dec,
                        8,
                        "k"
                    ],
                    [
                        dec,
                        9,
                        "l"
                    ],
                    [
                        dec,
                        6,
                        "m"
                    ],
                    [
                        dec,
                        7,
                        "o",
                        function() {}
                    ],
                    [
                        dec,
                        8,
                        "p",
                        function() {}
                    ],
                    [
                        dec,
                        9,
                        "q",
                        function(v) {}
                    ],
                    [
                        dec,
                        6,
                        "r",
                        function() {
                            return this.#__r;
                        },
                        function(_v) {
                            this.#__r = _v;
                        }
                    ],
                    [
                        dec,
                        5,
                        "i"
                    ],
                    [
                        dec,
                        5,
                        "n",
                        function() {
                            return this.#n;
                        },
                        function(value) {
                            this.#n = value;
                        }
                    ],
                    [
                        dec,
                        2,
                        "b"
                    ],
                    [
                        dec,
                        3,
                        "c"
                    ],
                    [
                        dec,
                        4,
                        "c"
                    ],
                    [
                        dec,
                        1,
                        "d"
                    ],
                    [
                        dec,
                        2,
                        "f",
                        function() {}
                    ],
                    [
                        dec,
                        3,
                        "g",
                        function() {}
                    ],
                    [
                        dec,
                        4,
                        "g",
                        function(v) {}
                    ],
                    [
                        dec,
                        1,
                        "h",
                        function() {
                            return this.#__h;
                        },
                        function(_v) {
                            this.#__h = _v;
                        }
                    ],
                    [
                        dec,
                        0,
                        "a"
                    ],
                    [
                        dec,
                        0,
                        "e",
                        function() {
                            return this.#e;
                        },
                        function(value) {
                            this.#e = value;
                        }
                    ]
                ], [
                    dec
                ]));
                _initStatic(this);
            }
            a = _init_a(this);
            b() {}
            get c() {}
            set c(v) {}
            #___private_d = (_initProto(this), _init_d(this));
            get d() {
                return this.#___private_d;
            }
            set d(_v) {
                this.#___private_d = _v;
            }
            #e = _init_e(this);
            get #f() {
                return _call_f;
            }
            get #g() {
                return _call_g(this);
            }
            set #g(v) {
                return _call_g1(this, v);
            }
            #__h = _init_h(this);
            get #h() {
                return _get___h(this);
            }
            set #h(_v) {
                _set___h(this, _v);
            }
            static i = _init_i(this);
            static j() {}
            static get k() {}
            static set l(v) {}
            static get m() {
                return this.#___private_m;
            }
            static set m(_v) {
                this.#___private_m = _v;
            }
        }
    }
    #___private_m = _init_m(this);
    #n = _init_n(this);
    get #o() {
        return _call_o;
    }
    get #p() {
        return _call_p(this);
    }
    set #q(v) {
        return _call_q(this, v);
    }
    #__r = _init_r(this);
    get #r() {
        return _get___r(this);
    }
    set #r(_v) {
        _set___r(this, _v);
    }
}();
