//// [commaOperatorOtherValidOperation.ts]
//Comma operator in for loop
for(var i = 0, j = 10; i < j; i++, j--){}
//Comma operator in function arguments and return
function foo(x, y) {
    return x, y;
}
var resultIsString = foo(1, "123");
//TypeParameters
function foo1() {
    var x;
    var y;
    x, y;
    var resultIsT1 = (y, x);
}
