if (true) {
    let blockLocal = 1;
    const blockConstant = 2;
    console.log(blockLocal, blockConstant);
}
function localFunction() {
    if (true) {
        var functionLocal = 3;
        console.log("function");
    }
    return functionLocal;
}
var arrowFunction = () => {
    if (true) {
        var arrowLocal = 4;
        console.log("arrow");
    }
    return arrowLocal;
};
class LocalClass {
    static {
        var staticLocal = 5;
        console.log(staticLocal);
    }
    constructor() {
        var constructorLocal = 6;
        console.log(constructorLocal);
    }
    method() {
        var methodLocal = 7;
        return methodLocal;
    }
}
var object = {
    get value() {
        var getterLocal = 8;
        return getterLocal;
    },
    set value(value) {
        var setterLocal = value;
        console.log(setterLocal);
    }
};
console.log(localFunction(), arrowFunction(), new LocalClass().method(), object.value);
object.value = 9;
if (true) {
    var afterFunctions = 10;
    console.log(afterFunctions);
}
