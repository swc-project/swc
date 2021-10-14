export class B {
    foo() { }
}

export class A extends B {
    static props = {}

    field = 1
}


const a = new A();
console.log(aa.field)