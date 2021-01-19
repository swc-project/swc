for (var x, i = 2; --i >= 0; ) {
    var y = x;
    x = f;
    console.log(x === y);
}
function f() {}
