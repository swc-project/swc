//// [commaOperatorOtherInvalidOperation.ts]
//Expect to have compiler errors
//Comma operator in function arguments and return
function foo(x, y) {
    return x, y;
}
var resultIsString = foo(1, "123"); //error here
//TypeParameters
function foo1() {
    var x;
    var y;
    var result = (x, y); //error here
}
