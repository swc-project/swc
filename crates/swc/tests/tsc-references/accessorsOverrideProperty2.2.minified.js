//// [accessorsOverrideProperty2.ts]
class Base {
    x = 1;
}
console.log(new class extends Base {
    get x() {
        return 2;
    }
    set x(value) {
        console.log(`x was set to ${value}`);
    }
}().x);
