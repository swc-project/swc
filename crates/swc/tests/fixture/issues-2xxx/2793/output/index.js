function foo() {}
function foo() {
    function bar() {}
}
///////////////////
{
    var foo1 = function foo1() {};
}{
    {
        var foo2 = function foo2() {};
    }
}if (true) {
    var foo3 = function foo3() {};
}
try {
    var foo4 = function foo4() {};
} catch (e) {
    var foo5 = function foo5() {};
} finally{
    var foo6 = function foo6() {};
}
switch(x){
    default:
        {
            var foo7 = function foo7() {};
        }
}
