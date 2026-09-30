if (true) {
    let o = 1;
    const r = 2;
    console.log(o, r);
}
function localFunction() {
    if (true) {
        var o = 3;
        console.log("function");
    }
    return o;
}
var arrowFunction = ()=>{
    if (true) {
        var o = 4;
        console.log("arrow");
    }
    return o;
};
class LocalClass {
    static{
        var o = 5;
        console.log(o);
    }
    constructor(){
        var o = 6;
        console.log(o);
    }
    method() {
        var o = 7;
        return o;
    }
}
var object = {
    get value () {
        var o = 8;
        return o;
    },
    set value (o){
        var r = o;
        console.log(r);
    }
};
console.log(localFunction(), arrowFunction(), new LocalClass().method(), object.value);
object.value = 9;
if (true) {
    var afterFunctions = 10;
    console.log(afterFunctions);
}
