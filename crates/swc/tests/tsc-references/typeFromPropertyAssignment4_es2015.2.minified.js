var local;
Outer.Inner = class {
    constructor(){
        this.y = 12;
    }
}, local.y, new Outer.Inner().y;
(void 0).y, new Outer.Inner().y;
