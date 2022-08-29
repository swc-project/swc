//// [accessorsOverrideProperty8.ts]
const Base = classWithProperties({
    get x () {
        return 'boolean';
    },
    y: 'string'
}, class {
}), mine = new class extends Base {
    get x() {
        return !1;
    }
    get y() {
        return 'hi';
    }
}();
mine.x;
