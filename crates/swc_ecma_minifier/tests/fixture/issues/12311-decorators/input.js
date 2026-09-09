function dec(cls) {}

function before() {
    console.log("before");
    return 1;
}

function decoratedClass() {
    let value = before();
    return [@dec class {}, value];
}
