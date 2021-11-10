//@target: ES6
var s = Symbol();
var x;
for(s in {
}){
}
for(x in s){
}
for(var y in s){
}
