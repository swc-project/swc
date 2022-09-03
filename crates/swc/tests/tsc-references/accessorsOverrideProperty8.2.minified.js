//// [accessorsOverrideProperty8.ts]
const Base = classWithProperties({
    get x () {
        return 'boolean';
    },
    y: 'string'
}, class {
});
class MyClass extends Base {
    get x() {
        return !1;
    }
    get y() {
        return 'hi';
    }
}
const mine = new MyClass(), value = mine.x;
