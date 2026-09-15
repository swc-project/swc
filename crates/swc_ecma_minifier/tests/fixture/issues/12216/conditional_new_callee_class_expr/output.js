function check() {
    return true;
}
const C = class F {
    make() {
        return new F(check() ? 1 : 2);
    }
};
console.log(new C().make());
