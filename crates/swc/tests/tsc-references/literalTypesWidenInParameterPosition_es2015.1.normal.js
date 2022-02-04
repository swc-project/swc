class D {
    constructor(widen = 2){
        this.widen = widen;
        this.noWiden = 1;
        this.noWiden = 5; // error
        this.widen = 6; // ok
    }
}
new D(7); // ok
