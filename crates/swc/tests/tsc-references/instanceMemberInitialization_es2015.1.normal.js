class C {
    constructor(){
        this.x = 1;
    }
}
var c = new C();
c.x = 3;
var c2 = new C();
var r = c.x === c2.x;
// #31792
class MyMap {
    constructor(Map_){
        this.Map_ = Map_;
        this.store = new this.Map_();
    }
}
