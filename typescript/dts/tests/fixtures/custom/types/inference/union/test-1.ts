type Func = (...args: any[]) => any;
type Spec = {
    a: Func | Spec;
};

declare function foo(): Spec;

const g = foo();