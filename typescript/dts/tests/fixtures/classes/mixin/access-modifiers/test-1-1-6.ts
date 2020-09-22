type Constructable = new (...args: any[]) => object;

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

function f6(x: Public & Public2) {
    x.p;  // Ok, public if any constituent is public
}
