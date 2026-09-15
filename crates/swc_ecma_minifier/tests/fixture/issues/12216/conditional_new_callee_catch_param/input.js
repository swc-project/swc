function C(value) {
    this.value = value;
}

function check() {
    return true;
}

function use(value) {
    console.log(value.value);
}

try {
    throw C;
} catch (F) {
    use(check() ? new F(1) : new F(2));
}
