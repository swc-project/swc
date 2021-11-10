function execute(callback) {
    callback();
}
class Foo {
    constructor(message) {
        this.message = message;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        execute(() => {
            this.go();
        });
    }
}
new Foo("FAIL").run();
