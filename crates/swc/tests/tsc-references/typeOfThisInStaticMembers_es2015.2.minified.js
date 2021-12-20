var t = (class {
    static bar() {
        return this;
    }
    constructor(x){
    }
}).bar();
t.foo + 1, t.bar(), new t(1);
var t2 = (class {
    static bar() {
        return this;
    }
    constructor(x){
    }
}).bar();
t2.foo + 1, t2.bar(), new t2("");
