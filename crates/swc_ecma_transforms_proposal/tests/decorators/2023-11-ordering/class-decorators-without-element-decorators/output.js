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
            _C_member = _C;
        }
    }
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new class extends _identity {
        constructor(){
            super(_C), _initClass(), _C_member = _C;
        }
        static [class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec,
                    _dec1
                ], []));
            }
            async [_computedKey1](v) {}
            [_computedKey2];
        }];
        [_computedKey];
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new class extends _identity {
        constructor(){
            super(_C), _initClass(), _C_member = _C;
        }
        static [class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec,
                    _dec1
                ], []));
            }
            get [_computedKey]() {}
            [_computedKey2];
        }];
        [_computedKey1];
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new class extends _identity {
        constructor(){
            super(_C), _initClass(), _C_member = _C;
        }
        static [class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec,
                    _dec1
                ], []));
            }
            [_computedKey];
            #___private__computedKey_1;
            get [_computedKey1]() {
                return this.#___private__computedKey_1;
            }
            set [_computedKey1](_v) {
                this.#___private__computedKey_1 = _v;
            }
        }];
        [_computedKey2];
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new class extends _identity {
        constructor(){
            super(_C), _initClass(), _C_member = _C;
        }
        static [class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec,
                    _dec1
                ], []));
            }
            static set [_computedKey](v) {}
            [_computedKey1];
        }];
        [_computedKey2];
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}{
    let _dec, _dec1, _initClass, _computedKey, _computedKey1, _computedKey2;
    const log = [];
    _dec = classDec1(log), _dec1 = classDec2(log), _computedKey = _to_property_key(log.push("k1")), _computedKey1 = _to_property_key(log.push("k2")), _computedKey2 = _to_property_key(log.push("k3"));
    let _C, _C_member;
    new class extends _identity {
        constructor(){
            super(_C), _initClass(), _C_member = _C;
        }
        static [class C {
            static{
                ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
                    _dec,
                    _dec1
                ], []));
            }
        }];
        [_computedKey];
        [_computedKey1];
        [_computedKey2];
    }();
    expect(log.join()).toBe("k1,k2,k3," + // ClassElementEvaluation
    "c1,c2," + // ApplyDecoratorsToClassDefinition
    "c3,c4,c5,c6");
}
