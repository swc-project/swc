//// [accessorsOverrideProperty8.ts]
const Base = classWithProperties({
    get x () {
        return 'boolean';
    },
    y: 'string'
}, class Base {
});
class MyClass extends Base {
    get x() {
        return false;
    }
    get y() {
        return 'hi';
    }
}
const mine = new MyClass();
const value = mine.x;
