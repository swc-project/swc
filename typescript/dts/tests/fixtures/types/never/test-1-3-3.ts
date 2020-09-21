function error1(message: string): never {
    throw new Error(message);
}

function fail1() {
    return error1("Something failed");
}

function check<T>(x: T | undefined) {
    return x || error1("Undefined value");
}

function test(cb: () => string) {
    let s = cb();
    return s;
}

let errorCallback = () => error1("Error callback");

test(() => "hello");
test(() => fail1());
test(() => {
    throw new Error();
});
test(errorCallback);
