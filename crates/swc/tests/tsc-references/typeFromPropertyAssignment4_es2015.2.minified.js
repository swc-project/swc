var local, x, Outer = {
};
Outer.Inner = class {
    constructor(){
        this.y = 12;
    }
}, local.y, new Outer.Inner().y, x.y, new Outer.Inner().y;
