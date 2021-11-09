const foo = {
    prop: true
};
const x = foo;
const y = foo;
const z = x;
// Repro from #30118
class Bar {
    cast(_name) {
    }
    pushThis() {
        Bar.instance.push(this);
    }
}
