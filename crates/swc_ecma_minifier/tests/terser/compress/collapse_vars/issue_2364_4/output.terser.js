function inc(obj) {
    return obj.count++;
}
function foo(bar, baz) {
    var result = inc(bar);
    return (foo.amount = baz.count), result;
}
var data = { count: 0 };
var answer = foo(data, data);
console.log(foo.amount, answer);
