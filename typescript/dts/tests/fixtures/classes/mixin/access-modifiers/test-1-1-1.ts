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

function f1(x: Private & Private2) {
    x.p;  // Error, private constituent makes property inaccessible
}
