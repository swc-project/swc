class CBase {
    foo(param) {
    }
    constructor(param1){
    }
}
class C extends CBase {
    constructor(){
        // Should be okay.
        // 'p' should have type 'string'.
        super({
            method (p) {
                p.length;
            }
        });
        // Should be okay.
        // 'p' should have type 'string'.
        super.foo({
            method (p) {
                p.length;
            }
        });
    }
}
