var s = {};
s.Base = class {
    constructor(){
        this.id = "PASS";
    }
};
s.Derived = class extends s.Base {
    constructor(){
        super();
        console.log(this.id);
    }
};
new s.Derived();
