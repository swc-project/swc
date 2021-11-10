// no errors expected
class C {
    foo(x) {
        return x;
    }
    constructor(data){
        this.data = data;
    }
}
var y = null;
var c = new C(y);
var r = c.foo(y);
