function single(value) {
    return [
        "" + value,
        "" + value,
        "" + value,
        "" + value,
        "" + value,
        [
            value = null
        ].join(),
        [
            value = void 0
        ].join(),
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
    console.log([
        mark("first", 1),
        mark("second", 2),
        "tail"
    ].join(""));
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
    let state = 1;
    console.log([
        {
            toString () {
                return state;
            },
            valueOf () {
                return state;
            }
        },
        "x" + (state = 2, "y")
    ].join(""));
    state = 1;
    console.log([
        {
            toString () {
                return state;
            },
            valueOf () {
                return state;
            }
        },
        (state = 2, "y")
    ].join(""));
    console.log(events.join(","));
}
function coercion() {
    console.log([
        {
            toString () {
                return "s";
            },
            valueOf () {
                return 1;
            }
        }
    ].join(""));
    console.log([
        {
            toString () {
                return "s";
            },
            valueOf () {
                return 1;
            }
        },
        "x"
    ].join(""));
}
function symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [
            Symbol(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function indirect_symbol_order() {
    const events = [];
    function make_symbol() {
        return Symbol();
    }
    function mark() {
        events.push("mark");
    }
    try {
        [
            make_symbol(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function parenthesized_object_coercion() {
    console.log([
        {
            toString () {
                return "s";
            },
            valueOf () {
                return 1;
            }
        }
    ].join(""));
}
function nested_addition_order() {
    let state = 1;
    function later() {
        state = 2;
        return "";
    }
    console.log([
        "head",
        {
            toString () {
                return state;
            },
            valueOf () {
                return state;
            }
        } + (later() + "y")
    ].join(""));
}
function class_coercion() {
    console.log([
        class {
            static valueOf() {
                return 1;
            }
            static toString() {
                return "s";
            }
        }
    ].join(""));
}
async function awaited() {
    return [
        [
            await null
        ].join(""),
        [
            await void 0
        ].join("")
    ].join("|");
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
coercion();
symbol_order();
indirect_symbol_order();
parenthesized_object_coercion();
nested_addition_order();
class_coercion();
awaited().then(console.log);
