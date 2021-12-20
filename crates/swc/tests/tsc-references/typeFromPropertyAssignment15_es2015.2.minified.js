var inner, Outer = {
};
Outer.Inner = class {
    m() {
    }
    constructor(){
        this.x = 1;
    }
}, inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
