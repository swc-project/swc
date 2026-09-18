function C(value) {
    this.value = value;
}
function check() {
    return true;
}
function use(value) {
    console.log(value.value);
}
for(let F = C;;){
    use(new F(check() ? 1 : 2));
    break;
}
for (let F of [
    C
])use(new F(check() ? 3 : 4));
