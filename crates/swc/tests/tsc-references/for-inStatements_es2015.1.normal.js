var aString;
for(aString in {}){}
var anAny;
for(anAny in {}){}
for(var x in {}){}
for(var x in []){}
for(var x in [
    1,
    2,
    3,
    4,
    5
]){}
function fn() {}
for(var x in fn()){}
for(var x in /[a-z]/){}
for(var x in new Date()){}
var c, d, e;
for(var x in c || d){}
for(var x in e ? c : d){}
for(var x in 42 ? c : d){}
for(var x in '' ? c : d){}
for(var x in 42 ? d[x] : c[x]){}
for(var x in c[d]){}
for(var x in (x)=>x){}
for(var x in function(x, y) {
    return x + y;
}){}
class A {
    biz() {
        for(var x in this.biz()){}
        for(var x in this.biz){}
        for(var x in this){}
        return null;
    }
    static baz() {
        for(var x in this){}
        for(var x in this.baz){}
        for(var x in this.baz()){}
        return null;
    }
}
class B extends A {
    boz() {
        for(var x in this.biz()){}
        for(var x in this.biz){}
        for(var x in this){}
        for(var x in super.biz){}
        for(var x in super.biz()){}
        return null;
    }
}
var i;
for(var x in i[42]){}
var M;
(function(M) {
    class X {
    }
    M.X = X;
})(M || (M = {}));
for(var x in M){}
for(var x in M.X){}
var Color;
(function(Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color || (Color = {}));
for(var x in Color){}
for(var x in Color.Blue){}
