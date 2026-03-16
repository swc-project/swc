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
    class C {
        static{
            ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                _dec,
                _dec1
            ], []));
        }
        [_computedKey];
        [_computedKey1];
        [_computedKey2];
        static{
            _initClass();
        }
    }
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _dec2, _dec3, _initClass1, _computedKey3, _computedKey4, _computedKey5;
    const log = [];
    let _C;
    _dec2 = classDec1(log), _dec3 = classDec2(log), _computedKey3 = log.push("k1"), _computedKey4 = log.push("k2"), _computedKey5 = log.push("k3");
    new class extends _identity {
        constructor(){
            super(_C), _initClass1();
        }
        static{
            class C {
                static{
                    ({ c: [_C, _initClass1] } = _apply_decs_2311(this, [
                        _dec2,
                        _dec3
                    ], []));
                }
                static [_computedKey3];
                async [_computedKey4](v) {}
                [_computedKey5];
            }
        }
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _dec4, _dec5, _initClass2, _computedKey6, _computedKey7, _computedKey8;
    const log = [];
    let _C;
    _dec4 = classDec1(log), _dec5 = classDec2(log), _computedKey6 = log.push("k1"), _computedKey7 = log.push("k2"), _computedKey8 = log.push("k3");
    new class extends _identity {
        constructor(){
            super(_C), _initClass2();
        }
        static{
            class C {
                static{
                    ({ c: [_C, _initClass2] } = _apply_decs_2311(this, [
                        _dec4,
                        _dec5
                    ], []));
                }
                get [_computedKey6]() {}
                static [_computedKey7];
                [_computedKey8];
            }
        }
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _dec6, _dec7, _initClass3, _computedKey9, _computedKey10, _computedKey11;
    const log = [];
    let _C;
    _dec6 = classDec1(log), _dec7 = classDec2(log), _computedKey9 = log.push("k1"), _computedKey10 = log.push("k3"), _computedKey11 = log.push("k2");
    new class extends _identity {
        constructor(){
            super(_C), _initClass3();
        }
        static{
            class C {
                static{
                    ({ c: [_C, _initClass3] } = _apply_decs_2311(this, [
                        _dec6,
                        _dec7
                    ], []));
                }
                [_computedKey9];
                #___private_computedKey_1;
                get [_computedKey11]() {
                    return this.#___private_computedKey_1;
                }
                set [_computedKey11](_v) {
                    this.#___private_computedKey_1 = _v;
                }
                static [_computedKey10];
            }
        }
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _dec8, _dec9, _initClass4, _computedKey12, _computedKey13, _computedKey14;
    const log = [];
    let _C;
    _dec8 = classDec1(log), _dec9 = classDec2(log), _computedKey12 = log.push("k1"), _computedKey13 = log.push("k2"), _computedKey14 = log.push("k3");
    new class extends _identity {
        constructor(){
            super(_C), _initClass4();
        }
        static{
            class C {
                static{
                    ({ c: [_C, _initClass4] } = _apply_decs_2311(this, [
                        _dec8,
                        _dec9
                    ], []));
                }
                static set [_computedKey12](v) {}
                [_computedKey13];
                static [_computedKey14];
            }
        }
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    var _dec10, _dec11, _initClass5, _computedKey15, _computedKey16, _computedKey17;
    const log = [];
    let _C;
    _dec10 = classDec1(log), _dec11 = classDec2(log), _computedKey15 = log.push("k1"), _computedKey16 = log.push("k2"), _computedKey17 = log.push("k3");
    new class extends _identity {
        constructor(){
            super(_C), _initClass5();
        }
        static{
            class C {
                static{
                    ({ c: [_C, _initClass5] } = _apply_decs_2311(this, [
                        _dec10,
                        _dec11
                    ], []));
                }
                static [_computedKey15];
                static [_computedKey16];
                static [_computedKey17];
            }
        }
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}
