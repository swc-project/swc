function a(a) {
    a();
}
class b {
    constructor(a){
        this.message = a;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        a(()=>{
            this.go();
        });
    }
}
new b("FAIL").run();
