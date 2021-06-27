var obj = {};
obj.Base = class {
    constructor() {
        this.id = "PASS";
    }
};
obj.Derived = class extends obj.Base {
    constructor() {
        super();
        console.log(this.id);
    }
};
new obj.Derived();
