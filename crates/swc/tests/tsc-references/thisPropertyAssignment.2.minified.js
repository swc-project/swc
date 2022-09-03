//// [a.js]
function F() {
    this.a = {}, this.a.b = {}, this.b = {}, this.b.c = {};
}
this.x = {}, this.x.y = {}, this.y = {}, this.y.z = {};
var f = new F();
f.a, f.b;
