function dec(cls) {}
function before() {
    return console.log("before"), 1;
}
function decoratedClass() {
    let value = before();
    return [
        @dec
        class {
        },
        value
    ];
}
