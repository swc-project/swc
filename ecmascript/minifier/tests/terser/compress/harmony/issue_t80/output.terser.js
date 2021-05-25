function foo(data = []) {
    if (1 == arguments.length) data = [data];
    return data;
}
console.log(JSON.stringify([foo(), foo(null), foo(5, 6)]));
