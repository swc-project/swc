type Constructable = new (...args: any[]) => object;

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

function f4(x: Protected & Protected2) {
    x.p;  // Error, protected when all constituents are protected
}