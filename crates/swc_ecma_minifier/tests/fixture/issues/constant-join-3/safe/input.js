function join(value, other, condition) {
    return [
        [value].join(),
        [value, other].join(""),
        ["head", value].join(""),
        ["head", condition ? null : other].join(""),
        [value, null, undefined, other].join("-"),
    ].join("|");
}
console.log(join(null, undefined, true));
console.log(join(1, 2, false));
