var aString;
for(aString in {
}){
}
var anAny;
for(anAny in {
}){
}
for(var x1 in {
}){
}
for(var x1 in []){
}
for(var x1 in [
    1,
    2,
    3,
    4,
    5
]){
}
function fn() {
}
for(var x1 in fn()){
}
for(var x1 in /[a-z]/){
}
for(var x1 in new Date()){
}
var c, d, e;
for(var x1 in c || d){
}
for(var x1 in e ? c : d){
}
for(var x1 in 42 ? c : d){
}
for(var x1 in '' ? c : d){
}
for(var x1 in 42 ? d[x1] : c[x1]){
}
for(var x1 in c[d]){
}
for(var x1 in (x)=>x
){
}
for(var x1 in function(x, y) {
    return x + y;
}){
}
class A {
    biz() {
        for(var x in this.biz()){
        }
        for(var x in this.biz){
        }
        for(var x in this){
        }
        return null;
    }
    static baz() {
        for(var x in this){
        }
        for(var x in this.baz){
        }
        for(var x in this.baz()){
        }
        return null;
    }
}
class B extends A {
    boz() {
        for(var x in this.biz()){
        }
        for(var x in this.biz){
        }
        for(var x in this){
        }
        for(var x in super.biz){
        }
        for(var x in super.biz()){
        }
        return null;
    }
}
var i;
for(var x1 in i[42]){
}
var M1;
(function(M) {
    class X {
    }
    M.X = X;
})(M1 || (M1 = {
}));
for(var x1 in M1){
}
for(var x1 in M1.X){
}
var Color1;
(function(Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color1 || (Color1 = {
}));
for(var x1 in Color1){
}
for(var x1 in Color1.Blue){
}
