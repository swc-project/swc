async function foo(a, b) {
    var _loop = async function(i) {
        var boo = await a();
        b(()=>boo);
    };
    for(var i = 0; i < 5; i++)await _loop(i);
}
