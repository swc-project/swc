// @allowUnreachableCode: true
function fn(x) {
    throw x;
}
(x)=>{
    throw x;
};
var y;
switch(y){
    case 'a':
        throw y;
    default:
        throw y;
}
var z = 0;
while(z < 10){
    throw z;
}
for(var i = 0;;){
    throw i;
}
for(var idx in {
}){
    throw idx;
}
do {
    throw null;
}while (true)
var j = 0;
while(j < 0){
    throw j;
}
class C {
    biz() {
        throw this.value;
    }
    constructor(){
        throw this;
    }
}
var aa = {
    id: 12,
    biz () {
        throw this;
    }
};
