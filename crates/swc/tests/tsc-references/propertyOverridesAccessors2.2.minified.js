//// [propertyOverridesAccessors2.ts]
class Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}
const obj = new class extends Base {
    x = 1;
}();
console.log(obj.x);
