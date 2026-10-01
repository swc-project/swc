// The arrow captures the constructor's new.target, not the child call's.
function Factory() {
    const f = async () => new.target;
    return function () {
        return f();
    };
}
(new Factory())().then(
    value => console.log(value === Factory),
    error => console.log(error.name),
);
