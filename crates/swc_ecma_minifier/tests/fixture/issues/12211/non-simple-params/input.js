function withDefault(value = "fallback", ...rest) {
    value = "changed";
    return arguments[0];
}

function withDestructuring({ value }, ...rest) {
    value = "changed";
    return arguments[0].value;
}

console.log(withDefault("original"), withDestructuring({ value: "original" }));
