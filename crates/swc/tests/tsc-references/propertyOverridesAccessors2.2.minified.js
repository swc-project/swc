//// [propertyOverridesAccessors2.ts]
class Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}
class Derived extends Base {
    x = 1;
}
const obj = new Derived();
console.log(obj.x);
