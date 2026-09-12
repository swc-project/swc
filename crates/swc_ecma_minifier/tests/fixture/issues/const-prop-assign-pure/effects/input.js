function effect(label) {
    console.log(label);
    return [];
}
function Simulator() {
    /abc/.index = 1;
    this._aircraft = [];
}
/abc/.index = effect("regex");
/abc/["index"] = effect("regex string key");
(function () {}.prototype.destroy = effect("function"));
(class {}.prototype.destroy = effect("class"));
(function () {}["prototype"]["destroy"] = effect("function string key"));
(class {}["prototype"]["destroy"] = effect("class string key"));
(function unused() { return effect("unreachable"); }.prototype.destroy = effect("nonempty function"));
try {
    /abc/.index = missing();
} catch (error) {
    console.log(error.name);
}
console.log(Array.isArray(new Simulator()._aircraft));
