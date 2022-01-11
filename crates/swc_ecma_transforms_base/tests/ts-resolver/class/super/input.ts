class A extends B {
    constructor() {
        super();
        const sym = "";
        console.log(super.sym + super[sym]);
    }
}
