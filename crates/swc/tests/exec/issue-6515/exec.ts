function CommonProp() {
    return (Base: any) => class extends Base {
        prop = 100;
    };
}

@CommonProp()
class ClassX {
    static original = ClassX;
    static capture = () => ClassX;

    static checkX() {
        return new ClassX().prop;
    }

    self = ClassX;

    method() {
        return { ClassX };
    }

    shadow(ClassX: unknown) {
        return ClassX;
    }
}

expect(ClassX.checkX()).toBe(100);
expect(ClassX.capture()).toBe(ClassX);
expect(ClassX.original).not.toBe(ClassX);
expect(new ClassX().self).toBe(ClassX);
expect(new ClassX().method().ClassX).toBe(ClassX);
expect(new ClassX().shadow(42)).toBe(42);

function inspect(Base: any) {
    expect(Base.self()).toBe(Base);
    expect(Base.before).toBe(Base);
    return class extends Base {};
}

@inspect
export class Named {
    static before = Named.self();
    static self() {
        return Named;
    }
}
expect(Named.self()).toBe(Named);

@inspect
export default class Default {
    static before = Default.self();
    static self() {
        return Default;
    }
}
expect(Default.self()).toBe(Default);

const classes = [];
for (let i = 0; i < 2; i++) {
    @CommonProp()
    class Repeated {
        static self() {
            return Repeated;
        }
    }
    classes.push(Repeated);
}
for (const cls of classes) {
    expect(cls.self()).toBe(cls);
}

@CommonProp()
class Outer {
    static inner() {
        @CommonProp()
        class Inner {
            static outer() {
                return Outer;
            }
            static self() {
                return Inner;
            }
        }
        return Inner;
    }
}
const Inner = Outer.inner();
expect(Inner.self()).toBe(Inner);
expect(Inner.outer()).toBe(Outer);

class Plain {
    static self() {
        return Plain;
    }
}
const OriginalPlain = Plain;
Plain = class extends Plain {};
expect(OriginalPlain.self()).toBe(OriginalPlain);

function parameter(target: any, key: unknown, index: number) {}
class Parameter {
    constructor(@parameter value: unknown) {}
    static self() {
        return Parameter;
    }
}
expect(Parameter.self()).toBe(Parameter);

@CommonProp()
class Assignment {
    static assign(value: any) {
        // @ts-ignore
        ({ Assignment } = value);
        return Assignment;
    }
}
expect(Assignment.assign({ Assignment })).toBe(Assignment);
