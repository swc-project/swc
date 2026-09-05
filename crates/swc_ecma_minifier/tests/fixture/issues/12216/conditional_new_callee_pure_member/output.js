function Widget(value) {
    this.value = value;
}
const ns = {
    Widget
};
function run(test) {
    return new ns.Widget(test ? 1 : 2);
}
console.log(run(true).value);
