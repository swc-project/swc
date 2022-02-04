// Repro from #26130
let mappedObject = {
    foo: {
        x: "hello"
    }
};
function bar(key) {
    const element = foo(mappedObject[key]);
    if (element == null) return;
    const x = element.x;
}
