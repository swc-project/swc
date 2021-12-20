class C {
    foo() {
        function temp(a) {
            var y;
            return y;
        }
        return temp(null);
    }
    constructor(){
        this.x = (a)=>{
            var y;
            return y;
        };
    }
}
var c = new C();
c.data = c.x(null);
c.data = c.foo();
