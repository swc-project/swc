var test1 = class X {
    [Symbol.toStringTag]() {}
};
function a() {
    const b = class Y {
        x() {}
    };
}
