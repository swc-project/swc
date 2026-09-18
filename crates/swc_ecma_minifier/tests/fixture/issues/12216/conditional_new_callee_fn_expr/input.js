function check() {
    return true;
}

const C = function F() {
    return check() ? new F(1) : new F(2);
};

C();
