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

function f1(x: Private & Private2) {
    x.p;  // Error, private constituent makes property inaccessible
}

function f2(x: Private & Protected) {
    x.p;  // Error, private constituent makes property inaccessible
}

function f3(x: Private & Public) {
    x.p;  // Error, private constituent makes property inaccessible
}

function f4(x: Protected & Protected2) {
    x.p;  // Error, protected when all constituents are protected
}

function f5(x: Protected & Public) {
    x.p;  // Ok, public if any constituent is public
}

function f6(x: Public & Public2) {
    x.p;  // Ok, public if any constituent is public
}
