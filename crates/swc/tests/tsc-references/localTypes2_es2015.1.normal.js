function f1() {
    function f() {
        class C {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        return C;
    }
    let C = f();
    let v = new C(10, 20);
    let x = v.x;
    let y = v.y;
}
function f2() {
    function f(x) {
        class C {
            constructor(y){
                this.y = y;
                this.x = x;
            }
        }
        return C;
    }
    let C = f(10);
    let v = new C(20);
    let x = v.x;
    let y = v.y;
}
function f3() {
    function f(x, y) {
        class C {
            constructor(){
                this.x = x;
                this.y = y;
            }
        }
        return C;
    }
    let C = f(10, 20);
    let v = new C();
    let x = v.x;
    let y = v.y;
}
