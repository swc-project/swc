function inc(obj) {
    return obj.count++;
}
function foo(bar) {
    var result = inc(bar);
    return (foo.amount = bar.count), result;
}
var data = { count: 0 };
var answer = foo(data);
console.log(foo.amount, answer);
