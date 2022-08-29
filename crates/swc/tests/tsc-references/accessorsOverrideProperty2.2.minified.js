//// [accessorsOverrideProperty2.ts]
class Base {
    x = 1;
}
const obj = new class extends Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}();
console.log(obj.x);
