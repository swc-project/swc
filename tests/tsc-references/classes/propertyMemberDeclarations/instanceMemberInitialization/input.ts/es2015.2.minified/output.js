class C {
    constructor(){
        this.x = 1;
    }
}
var c = new C();
c.x = 3;
var c2 = new C();
c.x === c2.x;
