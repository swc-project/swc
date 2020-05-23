function error1(message: string): never {
    throw new Error(message);
}

function errorVoid(message: string) {
    throw new Error(message);
}

function fail1() {
    return error1("Something failed");
}

function failOrThrow(shouldFail: boolean) {
    if (shouldFail) {
        return fail1();
    }
    throw new Error();
}

function check<T>(x: T | undefined) {
    return x || error1("Undefined value");
}

class C {
    void1() {
        throw new Error();
    }

    void2() {
        while (true) {
        }
    }

    never1(): never {
        throw new Error();
    }

    never2(): never {
        while (true) {
        }
    }
}

function f1(x: string | number) {
    if (typeof x === "boolean") {
        x;  // never
    }
}

function f2(x: string | number) {
    while (true) {
        if (typeof x === "boolean") {
            return x;  // never
        }
    }
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
