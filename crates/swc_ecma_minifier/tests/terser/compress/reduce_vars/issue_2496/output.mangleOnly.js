function e(s) {
    s();
}
class s {
    constructor(s){
        this.message = s;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        e(()=>{
            this.go();
        });
    }
}
new s("FAIL").run();
