function join(value, other, condition) {
    return [
        [
            value
        ].join(),
        [
            value,
            other
        ].join(""),
        [
            "head",
            value
        ].join(""),
        [
            "head",
            condition ? null : other
        ].join(""),
        [
            value,
            "-",
            other
        ].join("-")
    ].join("|");
}
console.log(join(null, void 0, true));
console.log(join(1, 2, false));
