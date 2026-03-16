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
    var _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    let _C;
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = log.push("k1"), _computedKey1 = log.push("k2"), _computedKey2 = log.push("k3");
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
    _initClass();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _class;
    var _dec2, _dec3, _initClass1, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    let _C;
    _dec2 = classDec1(log), _dec3 = classDec2(log), _computedKey3 = log.push("k1"), _computedKey4 = log.push("k2"), _computedKey5 = log.push("k3");
    new (_class = class extends _identity {
        constructor(){
            super(_C), _initClass1();
        }
    }, (()=>{
        let _computedKey = _computedKey4, _computedKey1 = _computedKey5;
        class C {
            async [_computedKey](v) {}
            constructor(){
                _define_property(this, _computedKey1, void 0);
            }
        }
        ({ c: [_C, _initClass1] } = _apply_decs_2311(C, [
            _dec2,
            _dec3
        ], []));
        _define_property(C, _computedKey3, void 0);
    })(), _class)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _class1;
    var _dec4, _dec5, _initClass2, _computedKey6, _computedKey7, _computedKey8;
    const log = [];
    let _C;
    _dec4 = classDec1(log), _dec5 = classDec2(log), _computedKey6 = log.push("k1"), _computedKey7 = log.push("k2"), _computedKey8 = log.push("k3");
    new (_class1 = class extends _identity {
        constructor(){
            super(_C), _initClass2();
        }
    }, (()=>{
        let _computedKey = _computedKey6, _computedKey1 = _computedKey8;
        class C {
            get [_computedKey]() {}
            constructor(){
                _define_property(this, _computedKey1, void 0);
            }
        }
        ({ c: [_C, _initClass2] } = _apply_decs_2311(C, [
            _dec4,
            _dec5
        ], []));
        _define_property(C, _computedKey7, void 0);
    })(), _class1)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _class2;
    var _dec6, _dec7, _initClass3, _computedKey9, _computedKey10, _computedKey11;
    const log = [];
    let _C;
    _dec6 = classDec1(log), _dec7 = classDec2(log), _computedKey9 = log.push("k1"), _computedKey10 = log.push("k3"), _computedKey11 = log.push("k2");
    new (_class2 = class extends _identity {
        constructor(){
            super(_C), _initClass3();
        }
    }, (()=>{
        var ____private_computedKey_1 = /*#__PURE__*/ new WeakMap();
        let _computedKey = _computedKey9, _computedKey1 = _computedKey11, _computedKey2 = _computedKey11, _computedKey3 = _computedKey10;
        class C {
            get [_computedKey1]() {
                return _class_private_field_get(this, ____private_computedKey_1);
            }
            set [_computedKey2](_v) {
                _class_private_field_set(this, ____private_computedKey_1, _v);
            }
            constructor(){
                _define_property(this, _computedKey, void 0);
                _class_private_field_init(this, ____private_computedKey_1, {
                    writable: true,
                    value: void 0
                });
            }
        }
        ({ c: [_C, _initClass3] } = _apply_decs_2311(C, [
            _dec6,
            _dec7
        ], []));
        _define_property(C, _computedKey3, void 0);
    })(), _class2)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _class3;
    var _dec8, _dec9, _initClass4, _computedKey12, _computedKey13, _computedKey14;
    const log = [];
    let _C;
    _dec8 = classDec1(log), _dec9 = classDec2(log), _computedKey12 = log.push("k1"), _computedKey13 = log.push("k2"), _computedKey14 = log.push("k3");
    new (_class3 = class extends _identity {
        constructor(){
            super(_C), _initClass4();
        }
    }, (()=>{
        let _computedKey = _computedKey12, _computedKey1 = _computedKey13, _computedKey2 = _computedKey14;
        class C {
            static set [_computedKey](v) {}
            constructor(){
                _define_property(this, _computedKey1, void 0);
            }
        }
        ({ c: [_C, _initClass4] } = _apply_decs_2311(C, [
            _dec8,
            _dec9
        ], []));
        _define_property(C, _computedKey2, void 0);
    })(), _class3)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _class4;
    var _dec10, _dec11, _initClass5, _computedKey15, _computedKey16, _computedKey17;
    const log = [];
    let _C;
    _dec10 = classDec1(log), _dec11 = classDec2(log), _computedKey15 = log.push("k1"), _computedKey16 = log.push("k2"), _computedKey17 = log.push("k3");
    new (_class4 = class extends _identity {
        constructor(){
            super(_C), _initClass5();
        }
    }, (()=>{
        class C {
        }
        ({ c: [_C, _initClass5] } = _apply_decs_2311(C, [
            _dec10,
            _dec11
        ], []));
        _define_property(C, _computedKey15, void 0);
        _define_property(C, _computedKey16, void 0);
        _define_property(C, _computedKey17, void 0);
    })(), _class4)();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}
