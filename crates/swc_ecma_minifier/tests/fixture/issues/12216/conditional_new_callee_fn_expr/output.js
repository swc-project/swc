function check() {
    return true;
}
const C = function F() {
    return new F(check() ? 1 : 2);
};
C();
