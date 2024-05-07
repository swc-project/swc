function foo() {}
function foo() {
    function bar() {}
}
///////////////////
{
    var foo = function foo() {};
}{
    {
        var foo = function foo() {};
    }
}if (true) {
    var foo = function foo() {};
}
try {
    var foo = function foo() {};
} catch (e) {
    var foo = function foo() {};
} finally{
    var foo = function foo() {};
}
switch(x){
    default:
        {
            var foo = function foo() {};
        }
}
