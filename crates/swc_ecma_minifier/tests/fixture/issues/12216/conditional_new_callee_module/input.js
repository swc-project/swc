export function F(value) {
    this.value = value;
}

export function check() {
    return true;
}

export function run() {
    return check() ? new F(1) : new F(2);
}
