type Constructable = new (...args: any[]) => object;

class Protected {
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

function f5(x: Protected & Public) {
    x.p;  // Ok, public if any constituent is public
}
