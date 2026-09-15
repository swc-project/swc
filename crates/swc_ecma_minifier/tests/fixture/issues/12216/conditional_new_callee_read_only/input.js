function C(n) {
    this.value = n;
}

function check() {
    return true;
}

function run(C) {
    return C && check() ? new C(1) : new C(2);
}

console.log(run(C).value);
