function test() {
    let value = foo();
    return [
        class {
            static accessor ["prototype"] = 0;
        },
        value
    ];
}
