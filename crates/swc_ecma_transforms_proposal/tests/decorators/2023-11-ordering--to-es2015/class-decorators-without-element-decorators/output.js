const classDec1 = (log)=>(cls, ctxClass)=>{
        log.push("c2");
        ctxClass.addInitializer(()=>log.push("c5"));
        ctxClass.addInitializer(()=>log.push("c6"));
    };
const classDec2 = (log)=>(cls, ctxClass)=>{
        log.push("c1");
        ctxClass.addInitializer(()=>log.push("c3"));
        ctxClass.addInitializer(()=>log.push("c4"));
    };
{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    let _computedKey3 = _computedKey, _computedKey4 = _computedKey1, _computedKey5 = _computedKey2;
    class C {
        constructor(){
            _define_property(this, _computedKey3, void 0);
            _define_property(this, _computedKey4, void 0);
            _define_property(this, _computedKey5, void 0);
        }
    }
    ({ c: [_C, _initClass] } = _apply_decs_2311(C, [
        _dec,
        _dec1
    ], []));
    (()=>{
        _initClass();
        _C_member = _C;
    })();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _computedKey, _computedKey1, _ref, _computedKey2;
    var _C, _class;
    let _dec, _dec1, _initClass, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey3 = _to_property_key(log.push("k1")), _computedKey4 = _to_property_key(log.push("k2")), _computedKey5 = _to_property_key(log.push("k3"));
    let _C1, _C_member;
    new (_ref = (_computedKey = _computedKey4, _computedKey1 = _computedKey5, _C = class C {
        async [_computedKey](v) {}
        constructor(){
            _define_property(this, _computedKey1, void 0);
        }
    }, { c: [_C1, _initClass] } = _apply_decs_2311(_C, [
        _dec,
        _dec1
    ], []), _C), _computedKey2 = _computedKey3, _class = class extends _identity {
        constructor(){
            super(_C1), _define_property(this, _computedKey2, void 0), _initClass(), _C_member = _C1;
        }
    }, _define_property(_class, _ref, void 0), _class)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _computedKey, _computedKey1, _ref, _computedKey2;
    var _C1, _class1;
    let _dec, _dec1, _initClass, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey3 = _to_property_key(log.push("k1")), _computedKey4 = _to_property_key(log.push("k2")), _computedKey5 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new (_ref = (_computedKey = _computedKey3, _computedKey1 = _computedKey5, _C1 = class C {
        get [_computedKey]() {}
        constructor(){
            _define_property(this, _computedKey1, void 0);
        }
    }, { c: [_C, _initClass] } = _apply_decs_2311(_C1, [
        _dec,
        _dec1
    ], []), _C1), _computedKey2 = _computedKey4, _class1 = class extends _identity {
        constructor(){
            super(_C), _define_property(this, _computedKey2, void 0), _initClass(), _C_member = _C;
        }
    }, _define_property(_class1, _ref, void 0), _class1)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _computedKey, _computedKey1, _computedKey2, _ref, _computedKey3;
    var ____private__computedKey_1, _C2, _class2;
    let _dec, _dec1, _initClass, _computedKey4, _computedKey5, _computedKey6;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey4 = _to_property_key(log.push("k1")), _computedKey5 = _to_property_key(log.push("k2")), _computedKey6 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new (_ref = (____private__computedKey_1 = /*#__PURE__*/ new WeakMap(), _computedKey = _computedKey4, _computedKey1 = _computedKey5, _computedKey2 = _computedKey5, _C2 = class C {
        get [_computedKey1]() {
            return _class_private_field_get(this, ____private__computedKey_1);
        }
        set [_computedKey2](_v) {
            _class_private_field_set(this, ____private__computedKey_1, _v);
        }
        constructor(){
            _define_property(this, _computedKey, void 0);
            _class_private_field_init(this, ____private__computedKey_1, {
                writable: true,
                value: void 0
            });
        }
    }, { c: [_C, _initClass] } = _apply_decs_2311(_C2, [
        _dec,
        _dec1
    ], []), _C2), _computedKey3 = _computedKey6, _class2 = class extends _identity {
        constructor(){
            super(_C), _define_property(this, _computedKey3, void 0), _initClass(), _C_member = _C;
        }
    }, _define_property(_class2, _ref, void 0), _class2)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _computedKey, _computedKey1, _ref, _computedKey2;
    var _C3, _class3;
    let _dec, _dec1, _initClass, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey3 = _to_property_key(log.push("k1")), _computedKey4 = _to_property_key(log.push("k2")), _computedKey5 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new (_ref = (_computedKey = _computedKey3, _computedKey1 = _computedKey4, _C3 = class C {
        static set [_computedKey](v) {}
        constructor(){
            _define_property(this, _computedKey1, void 0);
        }
    }, { c: [_C, _initClass] } = _apply_decs_2311(_C3, [
        _dec,
        _dec1
    ], []), _C3), _computedKey2 = _computedKey5, _class3 = class extends _identity {
        constructor(){
            super(_C), _define_property(this, _computedKey2, void 0), _initClass(), _C_member = _C;
        }
    }, _define_property(_class3, _ref, void 0), _class3)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _ref, _computedKey, _computedKey1, _computedKey2;
    var _C4, _class4;
    let _dec, _dec1, _initClass, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey3 = _to_property_key(log.push("k1")), _computedKey4 = _to_property_key(log.push("k2")), _computedKey5 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new (_ref = (_C4 = class C {
    }, { c: [_C, _initClass] } = _apply_decs_2311(_C4, [
        _dec,
        _dec1
    ], []), _C4), _computedKey = _computedKey3, _computedKey1 = _computedKey4, _computedKey2 = _computedKey5, _class4 = class extends _identity {
        constructor(){
            super(_C), _define_property(this, _computedKey, void 0), _define_property(this, _computedKey1, void 0), _define_property(this, _computedKey2, void 0), _initClass(), _C_member = _C;
        }
    }, _define_property(_class4, _ref, void 0), _class4)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}
