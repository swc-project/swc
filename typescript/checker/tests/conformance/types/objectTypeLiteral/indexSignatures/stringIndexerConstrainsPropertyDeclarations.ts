// String indexer types constrain the types of named properties in their containing type

interface MyString extends String {
    foo: number;
}

class C {
    [x: string]: string;

    constructor() { } // ok

    a: string; // ok
    b: number; // error
    c: () => {} // error
    "d": string; // ok
    "e": number; // error
    1.0: string; // ok
    2.0: number; // error
    "3.0": string; // ok
    "4.0": number; // error
    f: MyString; // error

    get X() { // ok
        return '';
    }
    set X(v) { } // ok

    foo() { // error
        return '';
    }

    static sa: number; // ok
    static sb: string; // ok

    static foo() { } // ok
    static get X() { // ok
        return 1;
    }
}

interface I {
    [x: string]: string;

    a: string; // ok
    b: number; // error
    c: () => {} // error
    "d": string; // ok
    "e": number; // error
    1.0: string; // ok
    2.0: number; // error
    (): string; // ok
    (x): number // ok
    foo(): string; // error
    "3.0": string; // ok
    "4.0": number; // error
    f: MyString; // error
}

var a: {
    [x: string]: string;

    a: string; // ok
    b: number; // error
    c: () => {} // error
    "d": string; // ok
    "e": number; // error
    1.0: string; // ok
    2.0: number; // error
    (): string; // ok
    (x): number // ok
    foo(): string; // error
    "3.0": string; // ok
    "4.0": number; // error
    f: MyString; // error
}

// error
var b: { [x: string]: string; } = {
    a: '',
    b: 1, 
    c: () => { }, 
    "d": '', 
    "e": 1, 
    1.0: '',
    2.0: 1, 
    "3.0": '', 
    "4.0": 1, 
    f: <MyString>null, 

    get X() { 
        return '';
    },
    set X(v) { }, 
    foo() { 
        return '';
    }
}