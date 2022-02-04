// @target: esnext
// @useDefineForClassFields: true
class Base {
    constructor(){
        this.x = 1;
    }
}
class Derived extends Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}
const obj = new Derived(); // nothing printed
console.log(obj.x); // 1
