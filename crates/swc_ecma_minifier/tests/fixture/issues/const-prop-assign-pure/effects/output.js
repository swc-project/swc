function effect(label) {
    console.log(label);
    return [];
}
function Simulator() {
    this._aircraft = [];
}
effect("regex");
effect("regex string key");
effect("function");
effect("class");
effect("function string key");
effect("class string key");
effect("nonempty function");
try {
    missing();
} catch (error) {
    console.log(error.name);
}
console.log(Array.isArray(new Simulator()._aircraft));
