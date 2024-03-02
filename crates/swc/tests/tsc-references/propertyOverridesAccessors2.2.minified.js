//// [propertyOverridesAccessors2.ts]
class Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}
console.log(new class extends Base {
    x = 1;
}().x);
