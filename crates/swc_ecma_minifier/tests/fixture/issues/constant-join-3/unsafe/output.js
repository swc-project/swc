function single(value) {
    return [
        "" + value,
        "" + value,
        "" + value,
        "" + value,
        "" + value,
        value + "x",
        "" + (value + value)
    ].join("|");
}
function concatenate(a, b, c) {
    return [
        "" + a + b,
        "" + (a + b) + c,
        "" + a + b + c + "tail",
        a + (b + c + "tail"),
        a + "bar" + c,
        a + "bar" + c,
        a + (b + "baz"),
        "foo" + a + b + "moo",
        "" + (a + b) + c + "tail",
        a + b + "" + c,
        "head" + (a + b),
        "head" + (a + b) + "tail"
    ].join("|");
}
function nullish(value) {
    return [
        "||,1,,3",
        [
            value,
            "---tail"
        ].join("-"),
        [
            "-foo-",
            value + "baz"
        ].join("-"),
        "foo" + value + "baz"
    ].join("|");
}
function effects() {
    var events = [];
    function mark(name, value) {
        events.push(name);
        return value;
    }
    console.log("" + mark("first", 1) + mark("second", 2) + "tail");
    console.log([
        void mark("void", 3)
    ].join());
    console.log([
        "head",
        void mark("mixed", 4)
    ].join(""));
    console.log([
        mark("element", 5)
    ].join((mark("separator", 6), "-")));
    console.log(events.join(","));
}
function spread(values) {
    return [
        1,
        ...values,
        2
    ].join("");
}
console.log(single(2));
console.log(single("a"));
console.log(concatenate(1, 2, 3));
console.log(concatenate("a", "b", "c"));
console.log(nullish("x"));
console.log(spread([
    null,
    ,
    3
]));
effects();
