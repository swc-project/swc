var M;
(function(M1) {
    function fn(x) {
        return '';
    }
    M1.fn = fn;
})(M || (M = {}));
var x;
switch(x){
    case '':
    case 12:
    case true:
    case null:
    case undefined:
    case new Date(12):
    case new Object():
    case /[a-z]/:
    case []:
    case {}:
    case {
        id: 12
    }:
    case [
        'a'
    ]:
    case typeof x:
    case typeof M:
    case M.fn(1):
    case (x)=>'':
    case ((x)=>'')(2):
    default:
}
// basic assignable check, rest covered in tests for 'assignment compatibility'
class C {
}
class D extends C {
}
switch(new C()){
    case new D():
    case {
        id: 12,
        name: ''
    }:
    case new C():
}
switch(''){
}
switch(12){
}
switch(true){
}
switch(null){
}
switch(undefined){
}
switch(new Date(12)){
}
switch(new Object()){
}
switch(/[a-z]/){
}
switch([]){
}
switch({}){
}
switch({
    id: 12
}){
}
switch([
    'a'
]){
}
switch((x)=>''){
}
switch(((x)=>'')(1)){
}
