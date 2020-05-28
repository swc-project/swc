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

// Can't derive from type with inaccessible properties

class C1 extends Mix(Private, Private2) {
}
