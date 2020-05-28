type Constructable = new (...args: any[]) => object;

class Private {
    constructor(...args: any[]) {
    }

    private p: string;
}

class Private2 {
    constructor(...args: any[]) {
    }

    private p: string;
}

class Protected {
    constructor(...args: any[]) {
    }

    protected p: string;
    protected static s: string;
}

class Protected2 {
    constructor(...args: any[]) {
    }

    protected p: string;
    protected static s: string;
}

class Public {
    constructor(...args: any[]) {
    }

    public p: string;
    public static s: string;
}

class Public2 {
    constructor(...args: any[]) {
    }

    public p: string;
    public static s: string;
}

declare function Mix<T, U>(c1: T, c2: U): T & U;

class C4 extends Mix(Protected, Protected2) {
    f(c4: C4, c5: C5, c6: C6) {
        c4.p;
        c5.p;
        c6.p;
    }

    static g() {
        C4.s;
        C5.s;
        C6.s
    }
}

class C5 extends Mix(Protected, Public) {
    f(c4: C4, c5: C5, c6: C6) {
        c4.p;  // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    }

    static g() {
        C4.s;  // Error, not in class deriving from Protected2
        C5.s;
        C6.s
    }
}

class C6 extends Mix(Public, Public2) {
    f(c4: C4, c5: C5, c6: C6) {
        c4.p;  // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    }

    static g() {
        C4.s;  // Error, not in class deriving from Protected2
        C5.s;
        C6.s
    }
}
