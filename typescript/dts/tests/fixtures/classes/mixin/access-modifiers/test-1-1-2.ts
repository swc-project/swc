type Constructable = new (...args: any[]) => object;

class Private {
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

function f2(x: Private & Protected) {
    x.p;  // Error, private constituent makes property inaccessible
}
