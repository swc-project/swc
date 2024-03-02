//// [a.js]
this.x = {}, this.x.y = {}, this.y = {}, this.y.z = {};
var f = new function() {
    this.a = {}, this.a.b = {}, this.b = {}, this.b.c = {};
}();
f.a, f.b;
