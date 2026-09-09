function* run() {
    for (let i = yield 0, read = () => i; i < 1;) {
        i = 42;
        console.log(eval("i"));
        break;
    }
}
var iterator = run();
iterator.next();
iterator.next(0);
