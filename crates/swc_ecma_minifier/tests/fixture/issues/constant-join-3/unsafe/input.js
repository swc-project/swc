function single(value) {
    return [
        [value].join(),
        [value].join(""),
        [value].join("-"),
        [value].join(null),
        [value].join(void 0),
        [value = null].join(),
        [value = void 0].join(),
        [value + "x"].join(),
        [value + value].join(),
    ].join("|");
}

function concatenate(a, b, c) {
    return [
        [a, b].join(""),
        [a + b, c].join(""),
        [a, b, c + "tail"].join(""),
        [a, b + c + "tail"].join(""),
        [a + "bar", c].join(""),
        [a, "bar" + c].join(""),
        [a, b + "baz"].join(""),
        ["foo" + a, null, b + "moo"].join(""),
        [a + b, c, "tail"].join(""),
        [a + b, null, c].join(""),
        ["head", a + b].join(""),
        ["head", a + b + "tail"].join(""),
    ].join("|");
}

function nullish(value) {
    return [
        [null].join(),
        [,].join(),
        [, 1, , 3].join(),
        [value, null, undefined, , "tail"].join("-"),
        [null, "foo", null, value + "baz"].join("-"),
        [null, "foo", null, value + "baz"].join(""),
    ].join("|");
}

function effects() {
    var events = [];
    function mark(name, value) {
        events.push(name);
        return value;
    }
    console.log([mark("first", 1), mark("second", 2), "tail"].join(""));
    console.log([void mark("void", 3)].join());
    console.log(["head", void mark("mixed", 4)].join(""));
    console.log([mark("element", 5)].join((mark("separator", 6), "-")));
    let state = 1;
    console.log([
        {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        },
        "x" + (state = 2, "y"),
    ].join(""));
    console.log(events.join(","));
}

async function awaited() {
    return [[await null].join(""), [await void 0].join("")].join("|");
}

function spread(values) {
    return [1, ...values, 2].join("");
}

console.log(single(2));
console.log(single("a"));
console.log(concatenate(1, 2, 3));
console.log(concatenate("a", "b", "c"));
console.log(nullish("x"));
console.log(spread([null, , 3]));
effects();
awaited().then(console.log);
