function parameter() {
    return function(rest) {
        return eval("rest.length");
    }([
        1
    ]);
}
function block() {
    {
        let rest = [
            1,
            2
        ];
        return eval("rest.length");
    }
}
console.log(parameter(1, 2));
console.log(block(1, 2));
