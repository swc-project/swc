// no errors
class C {
    get y() {
        return this.x;
    }
    set y(x) {
        this.y = this.x;
    }
    foo() {
        return this.foo;
    }
    static get y() {
        return this.x;
    }
    static set y(x) {
        this.y = this.x;
    }
    static foo() {
        return this.foo;
    }
    static bar() {
        this.foo();
    }
}
// added level of function nesting
class C2 {
    get y() {
        ()=>this.x;
        return null;
    }
    set y(x) {
        ()=>{
            this.y = this.x;
        };
    }
    foo() {
        ()=>this.foo;
    }
    static get y() {
        ()=>this.x;
        return null;
    }
    static set y(x) {
        ()=>{
            this.y = this.x;
        };
    }
    static foo() {
        ()=>this.foo;
    }
    static bar() {
        ()=>this.foo();
    }
}
