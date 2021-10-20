var aNumber;
for(aNumber in {
}){
}
var aBoolean;
for(aBoolean in {
}){
}
var aRegExp;
for(aRegExp in {
}){
}
for(var idx in {
}){
}
function fn() {
}
for(var x1 in fn()){
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
for(var x1 in c[23]){
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
