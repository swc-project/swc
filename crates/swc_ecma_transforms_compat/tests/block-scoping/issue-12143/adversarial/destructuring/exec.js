var trace = [];
var source = { get value() { trace.push("get"); return undefined; } };
for (let { value: i = 1 } = source,
    [later = i + 1, named = function () {}] = [], read = () => later; i < 2;) {
    i = 9;
    later = 42;
    console.log(read(), typeof named, trace.join());
    break;
}
