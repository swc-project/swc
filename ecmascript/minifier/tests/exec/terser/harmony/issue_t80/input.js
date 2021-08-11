function foo(data = []) {
    var u,
        v = "unused";
    if (arguments.length == 1) {
        data = [data];
    }
    return data;
}
console.log(JSON.stringify([foo(), foo(null), foo(5, 6)]));
