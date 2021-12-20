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
    let C1 = f();
    let v = new C1(10, "hello");
    let x1 = v.x;
    let y1 = v.y;
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
    let C2 = f(10);
    let v = new C2("hello");
    let x2 = v.x;
    let y2 = v.y;
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
    let C3 = f(10, "hello");
    let v = new C3();
    let x3 = v.x;
    let y3 = v.y;
}
