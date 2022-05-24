// @declaration: true
class C1 {
    f(x) {
        return undefined;
    }
    constructor(x){}
}
class C2 {
}
class C3 {
}
class C4 {
    f1() {
        return {
            a: this
        };
    }
    f2() {
        return [
            this
        ];
    }
    f3() {
        return [
            {
                a: this
            }
        ];
    }
    f4() {
        return ()=>this;
    }
    constructor(){
        this.x1 = {
            a: this
        };
        this.x2 = [
            this
        ];
        this.x3 = [
            {
                a: this
            }
        ];
        this.x4 = ()=>this;
    }
}
