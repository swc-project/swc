const A_SYMBOL = Symbol("A_SYMBOL");

export class A {
    private p1: typeof A_SYMBOL;
    private constructor(a: typeof A_SYMBOL) {}
    private accessor myProperty: typeof A_SYMBOL;
    private func1(a: typeof A_SYMBOL): typeof A_SYMBOL | null {
        return null;
    }
}

export class B {
    private constructor(private a: typeof A_SYMBOL) {}
}

export class C {
    #p1: typeof A_SYMBOL;
    accessor #myProperty: typeof A_SYMBOL;
    #f(a: typeof A_SYMBOL) {}
}
