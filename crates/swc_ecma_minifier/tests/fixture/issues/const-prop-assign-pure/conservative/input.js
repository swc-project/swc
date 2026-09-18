const events = [];
function effect(label) {
    events.push(label);
    return label;
}
const key = {
    toString() {
        return effect("coerce");
    }
};
(function () {}.prototype[key] = effect("computed rhs"));
(class {}.prototype[effect("key")] = effect("class rhs"));
(class {
    set value(value) {
        events.push(value);
    }
}.prototype.value = "setter");
class Base {
    set value(value) {
        events.push(value);
    }
}
(class extends Base {}.prototype.value = "inherited setter");
let escaped;
(class {
    static {
        escaped = this;
        events.push("static");
    }
}.prototype.value = "escaped");
events.push(escaped.prototype.value);
const shared = {};
({ value: shared }).value.value = "identity";
events.push(shared.value);
({
    get value() {
        events.push("getter");
        return shared;
    }
}).value.value = "getter identity";
events.push(shared.value);
({
    ...{
        get value() {
            events.push("spread getter");
            return shared;
        }
    }
}).value.value = "spread identity";
events.push(shared.value);
(function () {}.prototype.value += effect("compound rhs"));
try {
    (async function () {}.prototype.value = effect("async rhs"));
} catch (error) {
    events.push(error.name);
}
console.log(events.join(","));
