type Constructable = new (...args: any[]) => object;

class Private {
    constructor(...args: any[]) {
    }

    private p: string;
}

class Public {
    constructor(...args: any[]) {
    }

    public p: string;
    public static s: string;
}

function f3(x: Private & Public) {
    x.p;  // Error, private constituent makes property inaccessible
}
