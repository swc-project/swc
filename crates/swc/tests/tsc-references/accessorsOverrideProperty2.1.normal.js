//// [accessorsOverrideProperty2.ts]
class Base {
    x = 1;
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
console.log(obj.x); // number
