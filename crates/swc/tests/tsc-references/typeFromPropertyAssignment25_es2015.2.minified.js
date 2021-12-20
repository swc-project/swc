var Common = {
};
Common.I = class {
    constructor(){
        this.i = 1;
    }
}, Common.O = class extends Common.I {
    constructor(){
        super(), this.o = 2;
    }
};
var o = new Common.O(), i = new Common.I();
o.i, o.o, i.i;
