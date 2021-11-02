(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
class X {
    m() {
    }
    mistake() {
    }
    constructor(){
        this.m = this.m.bind(this), this.mistake = "frankly, complete nonsense";
    }
}
let x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
class Y {
    mistake() {
    }
    m() {
    }
    constructor(){
        this.m = this.m.bind(this), this.mistake = "even more nonsense";
    }
}
Y.prototype.mistake = !0;
let y = new Y();
y.m(), y.mistake();
