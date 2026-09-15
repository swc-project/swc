function check() {
    return true;
}

const C = class F {
    make() {
        return check() ? new F(1) : new F(2);
    }
};

console.log(new C().make());
