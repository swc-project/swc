class Foo {
    constructor(message){
        this.message = message;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        (function(callback) {
            callback();
        })(()=>{
            this.go();
        });
    }
}
new Foo("FAIL").run();
