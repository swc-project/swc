function s(s) {
    s();
}
class e {
    constructor(s) {
        this.message = s;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        s(() => {
            this.go();
        });
    }
}
new e("FAIL").run();
