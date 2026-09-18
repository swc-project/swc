function A(n) {
    this.value = "A" + n;
}
function G(n) {
    this.value = "G" + n;
}
function run() {
    for(let F in {
        value: A
    }){
        F = A;
        return eval("F = G, true") ? new F(1) : new F(2);
    }
}
console.log(run().value);
