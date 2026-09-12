function C(value) {
    this.value = value;
}

function check() {
    return true;
}

function use(value) {
    console.log(value.value);
}

for (let F = C;;) {
    use(check() ? new F(1) : new F(2));
    break;
}

for (let F of [C]) {
    use(check() ? new F(3) : new F(4));
}
