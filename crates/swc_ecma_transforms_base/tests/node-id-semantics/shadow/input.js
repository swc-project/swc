let value = 1;
{
    let value = 2;
    value;
}
function outer(param) {
    var value = param;
    function inner() {
        return value;
    }
    return inner;
}
