var a = {};
a.Base = class {
    constructor(){
        this.id = "PASS";
    }
};
a.Derived = class extends a.Base {
    constructor(){
        super();
        console.log(this.id);
    }
};
new a.Derived();
