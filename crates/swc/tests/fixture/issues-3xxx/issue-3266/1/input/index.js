function bar(fooArg) {
    switch (true) {
        case true:
            const fooArg = "test"; // should rename
            return "bar() result";
    }
}
console.log(bar());
