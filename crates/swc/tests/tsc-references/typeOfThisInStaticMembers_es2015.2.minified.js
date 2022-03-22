var t = (class {
    static bar() {
        return this;
    }
    constructor(x){}
}).bar();
t.foo, t.bar(), new t(1);
var t2 = (class {
    static bar() {
        return this;
    }
    constructor(x){}
}).bar();
t2.foo, t2.bar(), new t2('');
