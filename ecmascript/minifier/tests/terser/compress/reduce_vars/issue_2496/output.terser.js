new (class {
    constructor(message) {
        this.message = message;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        (function (callback) {
            callback();
        })(() => {
            this.go();
        });
    }
})("FAIL").run();
