(() => {
    const log = [];
    // Class decorators
    const classDec1 = (cls, ctxClass) => {
        log.push('c2');
        if (!assertEq(() => typeof ctxClass.addInitializer, 'function'))
            return;
        ctxClass.addInitializer(() => log.push('c5'));
        ctxClass.addInitializer(() => log.push('c6'));
    };
    const classDec2 = (cls, ctxClass) => {
        log.push('c1');
        if (!assertEq(() => typeof ctxClass.addInitializer, 'function'))
            return;
        ctxClass.addInitializer(() => log.push('c3'));
        ctxClass.addInitializer(() => log.push('c4'));
    };
    // Method decorators
    const methodDec1 = (fn, ctxMethod) => {
        log.push('m2');
        if (!assertEq(() => typeof ctxMethod.addInitializer, 'function'))
            return;
        ctxMethod.addInitializer(() => log.push('m5'));
        ctxMethod.addInitializer(() => log.push('m6'));
    };
    const methodDec2 = (fn, ctxMethod) => {
        log.push('m1');
        if (!assertEq(() => typeof ctxMethod.addInitializer, 'function'))
            return;
        ctxMethod.addInitializer(() => log.push('m3'));
        ctxMethod.addInitializer(() => log.push('m4'));
    };
    const staticMethodDec1 = (fn, ctxStaticMethod) => {
        log.push('M2');
        if (!assertEq(() => typeof ctxStaticMethod.addInitializer, 'function'))
            return;
        ctxStaticMethod.addInitializer(() => log.push('M5'));
        ctxStaticMethod.addInitializer(() => log.push('M6'));
    };
    const staticMethodDec2 = (fn, ctxStaticMethod) => {
        log.push('M1');
        if (!assertEq(() => typeof ctxStaticMethod.addInitializer, 'function'))
            return;
        ctxStaticMethod.addInitializer(() => log.push('M3'));
        ctxStaticMethod.addInitializer(() => log.push('M4'));
    };
    // Field decorators
    const fieldDec1 = (value, ctxField) => {
        log.push('f2');
        if (!assertEq(() => typeof ctxField.addInitializer, 'function'))
            return;
        ctxField.addInitializer(() => log.push('f5'));
        ctxField.addInitializer(() => log.push('f6'));
        return () => { log.push('f7'); };
    };
    const fieldDec2 = (value, ctxField) => {
        log.push('f1');
        if (!assertEq(() => typeof ctxField.addInitializer, 'function'))
            return;
        ctxField.addInitializer(() => log.push('f3'));
        ctxField.addInitializer(() => log.push('f4'));
        return () => { log.push('f8'); };
    };
    const staticFieldDec1 = (value, ctxStaticField) => {
        log.push('F2');
        if (!assertEq(() => typeof ctxStaticField.addInitializer, 'function'))
            return;
        ctxStaticField.addInitializer(() => log.push('F5'));
        ctxStaticField.addInitializer(() => log.push('F6'));
        return () => { log.push('F7'); };
    };
    const staticFieldDec2 = (value, ctxStaticField) => {
        log.push('F1');
        if (!assertEq(() => typeof ctxStaticField.addInitializer, 'function'))
            return;
        ctxStaticField.addInitializer(() => log.push('F3'));
        ctxStaticField.addInitializer(() => log.push('F4'));
        return () => { log.push('F8'); };
    };
    // Getter decorators
    const getterDec1 = (fn, ctxGetter) => {
        log.push('g2');
        if (!assertEq(() => typeof ctxGetter.addInitializer, 'function'))
            return;
        ctxGetter.addInitializer(() => log.push('g5'));
        ctxGetter.addInitializer(() => log.push('g6'));
    };
    const getterDec2 = (fn, ctxGetter) => {
        log.push('g1');
        if (!assertEq(() => typeof ctxGetter.addInitializer, 'function'))
            return;
        ctxGetter.addInitializer(() => log.push('g3'));
        ctxGetter.addInitializer(() => log.push('g4'));
    };
    const staticGetterDec1 = (fn, ctxStaticGetter) => {
        log.push('G2');
        if (!assertEq(() => typeof ctxStaticGetter.addInitializer, 'function'))
            return;
        ctxStaticGetter.addInitializer(() => log.push('G5'));
        ctxStaticGetter.addInitializer(() => log.push('G6'));
    };
    const staticGetterDec2 = (fn, ctxStaticGetter) => {
        log.push('G1');
        if (!assertEq(() => typeof ctxStaticGetter.addInitializer, 'function'))
            return;
        ctxStaticGetter.addInitializer(() => log.push('G3'));
        ctxStaticGetter.addInitializer(() => log.push('G4'));
    };
    // Setter decorators
    const setterDec1 = (fn, ctxSetter) => {
        log.push('s2');
        if (!assertEq(() => typeof ctxSetter.addInitializer, 'function'))
            return;
        ctxSetter.addInitializer(() => log.push('s5'));
        ctxSetter.addInitializer(() => log.push('s6'));
    };
    const setterDec2 = (fn, ctxSetter) => {
        log.push('s1');
        if (!assertEq(() => typeof ctxSetter.addInitializer, 'function'))
            return;
        ctxSetter.addInitializer(() => log.push('s3'));
        ctxSetter.addInitializer(() => log.push('s4'));
    };
    const staticSetterDec1 = (fn, ctxStaticSetter) => {
        log.push('S2');
        if (!assertEq(() => typeof ctxStaticSetter.addInitializer, 'function'))
            return;
        ctxStaticSetter.addInitializer(() => log.push('S5'));
        ctxStaticSetter.addInitializer(() => log.push('S6'));
    };
    const staticSetterDec2 = (fn, ctxStaticSetter) => {
        log.push('S1');
        if (!assertEq(() => typeof ctxStaticSetter.addInitializer, 'function'))
            return;
        ctxStaticSetter.addInitializer(() => log.push('S3'));
        ctxStaticSetter.addInitializer(() => log.push('S4'));
    };
    // Auto-accessor decorators
    const accessorDec1 = (target, ctxAccessor) => {
        log.push('a2');
        if (!assertEq(() => typeof ctxAccessor.addInitializer, 'function'))
            return;
        ctxAccessor.addInitializer(() => log.push('a5'));
        ctxAccessor.addInitializer(() => log.push('a6'));
        return { init() { log.push('a7'); } };
    };
    const accessorDec2 = (target, ctxAccessor) => {
        log.push('a1');
        if (!assertEq(() => typeof ctxAccessor.addInitializer, 'function'))
            return;
        ctxAccessor.addInitializer(() => log.push('a3'));
        ctxAccessor.addInitializer(() => log.push('a4'));
        return { init() { log.push('a8'); } };
    };
    const staticAccessorDec1 = (target, ctxStaticAccessor) => {
        log.push('A2');
        if (!assertEq(() => typeof ctxStaticAccessor.addInitializer, 'function'))
            return;
        ctxStaticAccessor.addInitializer(() => log.push('A5'));
        ctxStaticAccessor.addInitializer(() => log.push('A6'));
        return { init() { log.push('A7'); } };
    };
    const staticAccessorDec2 = (target, ctxStaticAccessor) => {
        log.push('A1');
        if (!assertEq(() => typeof ctxStaticAccessor.addInitializer, 'function'))
            return;
        ctxStaticAccessor.addInitializer(() => log.push('A3'));
        ctxStaticAccessor.addInitializer(() => log.push('A4'));
        return { init() { log.push('A8'); } };
    };
    log.push('start');
    const Foo = 
    @classDec1
    @classDec2
    class extends (log.push('extends'), Object) {
        static { log.push('static:start'); }
        constructor() {
            log.push('ctor:start');
            super();
            log.push('ctor:end');
        }
        @methodDec1
        @methodDec2
        method() { }
        @staticMethodDec1
        @staticMethodDec2
        static method() { }
        @fieldDec1
        @fieldDec2
        field;
        @staticFieldDec1
        @staticFieldDec2
        static field;
        @getterDec1
        @getterDec2
        get getter() { return; }
        @staticGetterDec1
        @staticGetterDec2
        static get getter() { return; }
        @setterDec1
        @setterDec2
        set setter(x) { }
        @staticSetterDec1
        @staticSetterDec2
        static set setter(x) { }
        @accessorDec1
        @accessorDec2
        accessor accessor;
        @staticAccessorDec1
        @staticAccessorDec2
        static accessor accessor;
        static { log.push('static:end'); }
    };
    log.push('after');
    new Foo;
    log.push('end');
    assertEq(() => log + '', 'start,extends,' +
        'M1,M2,G1,G2,S1,S2,A1,A2,' + // For each element e of staticElements if e.[[Kind]] is not field
        'm1,m2,g1,g2,s1,s2,a1,a2,' + // For each element e of instanceElements if e.[[Kind]] is not field
        'F1,F2,' + // For each element e of staticElements if e.[[Kind]] is field
        'f1,f2,' + // For each element e of instanceElements if e.[[Kind]] is field
        'c1,c2,' + // ApplyDecoratorsToClassDefinition
        'M3,M4,M5,M6,G3,G4,G5,G6,S3,S4,S5,S6,' + // For each element initializer of staticMethodExtraInitializers
        'static:start,' + // For each element elementRecord of staticElements
        'F7,F8,F3,F4,F5,F6,' + // InitializeFieldOrAccessor + For each element initializer of elementRecord.[[ExtraInitializers]]
        'A7,A8,A3,A4,A5,A6,' + // InitializeFieldOrAccessor + For each element initializer of elementRecord.[[ExtraInitializers]]
        'static:end,' + // For each element elementRecord of staticElements
        'c3,c4,c5,c6,' + // For each element initializer of classExtraInitializers
        'after,' +
        'ctor:start,' +
        'm3,m4,m5,m6,g3,g4,g5,g6,s3,s4,s5,s6,' + // For each element initializer of constructor.[[Initializers]] (a.k.a. instanceMethodExtraInitializers)
        'f7,f8,f3,f4,f5,f6,' + // InitializeFieldOrAccessor + For each element initializer of elementRecord.[[ExtraInitializers]]
        'a7,a8,a3,a4,a5,a6,' + // InitializeFieldOrAccessor + For each element initializer of elementRecord.[[ExtraInitializers]]
        'ctor:end,' +
        'end');
})();
