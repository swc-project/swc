function fn1(param) {
    var x = param.x, y = param.y;
    return x + y;
}
function fn2(param) {
    var x = param.x, y = param.y;
    var fn3 = fn1;
    return fn3({
        x: x,
        y: y
    });
}
export { };
