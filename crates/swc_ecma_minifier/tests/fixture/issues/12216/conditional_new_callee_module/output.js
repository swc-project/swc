export function F(value) {
    this.value = value;
}
export function check() {
    return true;
}
export function run() {
    return new F(check() ? 1 : 2);
}
