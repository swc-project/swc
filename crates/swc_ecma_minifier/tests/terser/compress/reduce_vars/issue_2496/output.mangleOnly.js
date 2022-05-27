function b(a) {
    a();
}
class a {
    constructor(a){
        this.message = a;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        b(()=>{
            this.go();
        });
    }
}
new a("FAIL").run();
