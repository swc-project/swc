function withDefault(value = "fallback") {
    value = "changed";
    return arguments[0];
}
function withDestructuring({ value }) {
    value = "changed";
    return arguments[0].value;
}
console.log(withDefault("original"), withDestructuring({
    value: "original"
}));
