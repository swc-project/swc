class A {
    b;

    constructor(b) {
        this.b = b;
    }

    c = (i = 1) => {
        this.b += i;
    };
}

const a1 = new A(1);
const a2 = new A(2);
a1.c();
console.assert(a1.b === 2);
console.assert(a2.b === 2);

export {};
