function factory(value: unknown): any { return () => {}; }
function method() {
    class C {
        @factory((() => { enum E { A = later } return E.A; })())
        run() {}
    }
    const later = 1;
    return C;
}
function parameter() {
    class C {
        run(@factory((() => { enum E { A = later } return E.A; })()) value: unknown) {}
    }
    const later = 1;
    return C;
}
function constructorParameter() {
    class C {
        constructor(@factory((() => { enum E { A = later } return E.A; })()) value: unknown) {}
    }
    const later = 1;
    return C;
}
function parameterProperty() {
    class C {
        constructor(@factory((() => { enum E { A = later } return E.A; })()) public value: unknown) {}
    }
    const later = 1;
    return C;
}
function enumMember() {
    class C {
        @factory((() => { enum E { A = Later.A } return E.A; })())
        run() {}
    }
    enum Later { A = 1 }
    return C;
}
function initialized() {
    const earlier = 1;
    class C {
        @factory((() => { enum E { A = earlier } return E.A; })())
        run(value = (() => { enum E { A = later } return E.A; })()) {
            enum E { A = later }
            return [value, E.A];
        }
        constructor(public value = (() => { enum E { A = later } return E.A; })()) {}
    }
    const later = 2;
    const instance = new C();
    return [instance.value, ...instance.run()];
}
expect(method).toThrow(ReferenceError);
expect(parameter).toThrow(ReferenceError);
expect(constructorParameter).toThrow(ReferenceError);
expect(parameterProperty).toThrow(ReferenceError);
expect(enumMember).toThrow(ReferenceError);
expect(initialized()).toEqual([2, 2, 2]);
