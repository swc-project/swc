function inc(obj) {
    return obj.count++;
}
function foo() {
    var first = arguments[0];
    var result = inc(first);
    return (foo.amount = first.count), result;
}
var data = { count: 0 };
var answer = foo(data);
console.log(foo.amount, answer);
