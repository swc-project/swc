function test() {
    let value = foo();
    return [
        class {
            accessor [function() {
                return bar();
            }()] = 0;
        },
        value
    ];
}
