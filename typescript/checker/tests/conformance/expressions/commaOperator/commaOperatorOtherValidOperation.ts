// @allowUnreachableCode: true

//Comma operator in for loop
for (var i = 0, j = 10; i < j; i++, j--)
{
}

//Comma operator in fuction arguments and return
function foo(x: number, y: string)
{
    return x, y;
}
var resultIsString = foo(1, "123");

//TypeParameters
function foo1<T1, T2>()
{
    var x: T1;
    var y: T2;
    x, y;
    var resultIsT1 = (y, x);
}
