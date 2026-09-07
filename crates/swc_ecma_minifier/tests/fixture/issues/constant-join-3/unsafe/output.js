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
        [
            a,
            b
        ].join(""),
        "" + (a + b) + c,
        [
            a,
            b,
            c + "tail"
        ].join(""),
        [
            a,
            b + c + "tail"
        ].join(""),
        a + "bar" + c,
        [
            a,
            "bar" + c
        ].join(""),
        [
            a,
            b + "baz"
        ].join(""),
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
function member_symbol_order() {
    const events = [];
    const factory = {
        make () {
            return Symbol();
        }
    };
    function mark() {
        events.push("mark");
    }
    try {
        [
            factory.make(),
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
async function awaited_symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [
            await Symbol(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
async function awaited_object_order() {
    let state = 1;
    console.log([
        await {
            toString () {
                return state;
            },
            valueOf () {
                return state;
            }
        },
        state = 2
    ].join(""));
}
function value_selecting_object_coercion(flag, value) {
    console.log([
        flag ? {
            toString () {
                return "s";
            },
            valueOf () {
                return 1;
            }
        } : 0
    ].join(""));
    console.log([
        flag && class {
            static toString() {
                return "s";
            }
            static valueOf() {
                return 1;
            }
        }
    ].join(""));
    console.log([
        !flag || class {
            static toString() {
                return "s";
            }
            static valueOf() {
                return 1;
            }
        }
    ].join(""));
    console.log([
        value ?? class {
            static toString() {
                return "s";
            }
            static valueOf() {
                return 1;
            }
        }
    ].join(""));
}
function value_selecting_symbol_order(flag, value) {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        console.log([
            flag ? Symbol() : 0,
            mark()
        ].join(""));
    } catch  {}
    try {
        console.log([
            flag && Symbol(),
            mark()
        ].join(""));
    } catch  {}
    try {
        console.log([
            !flag || Symbol(),
            mark()
        ].join(""));
    } catch  {}
    try {
        console.log([
            value ?? Symbol(),
            mark()
        ].join(""));
    } catch  {}
    console.log(events.join(","));
}
function assigned_class_coercion() {
    let assigned;
    console.log([
        assigned = class {
            static valueOf() {
                return 1;
            }
            static toString() {
                return "s";
            }
        }
    ].join(""));
}
function assigned_symbol_order() {
    let assigned;
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [
            assigned = Symbol(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function logical_assigned_symbol_order() {
    let assigned;
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [
            assigned ||= Symbol(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function logical_assigned_nullish() {
    let assigned;
    return [
        assigned ||= null
    ].join("");
}
function logical_assigned_class_coercion() {
    let assigned;
    console.log([
        assigned ||= class {
            static valueOf() {
                return 1;
            }
            static toString() {
                return "s";
            }
        }
    ].join(""));
}
function tagged_template_symbol_order() {
    const events = [];
    function tag() {
        return Symbol();
    }
    function mark() {
        events.push("mark");
    }
    try {
        [
            tag`x`,
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function optional_member_symbol_order() {
    const events = [];
    const factory = {
        make () {
            return Symbol();
        }
    };
    function mark() {
        events.push("mark");
    }
    try {
        [
            factory?.make(),
            mark()
        ].join("");
    } catch  {}
    console.log(events.join(","));
}
function conditional_nullish_join(flag) {
    return [
        flag ? null : 1
    ].join("");
}
function call_object_coercion() {
    function make() {
        return {
            toString () {
                return "s";
            },
            valueOf () {
                return 1;
            }
        };
    }
    return [
        make()
    ].join("");
}
function identifier_symbol_order(value) {
    let hit = false;
    try {
        [
            value,
            hit = true
        ].join("");
    } catch  {}
    return hit;
}
function optional_member_nullish(value) {
    return [
        value?.field
    ].join("");
}
function member_value_symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [
            {
                value: Symbol()
            }.value,
            mark()
        ].join("");
    } catch  {}
    return events.join(",");
}
function member_object_coercion() {
    return [
        {
            value: {
                toString () {
                    return "s";
                },
                valueOf () {
                    return 1;
                }
            }
        }.value
    ].join("");
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
member_symbol_order();
parenthesized_object_coercion();
nested_addition_order();
class_coercion();
awaited().then(console.log);
awaited_symbol_order();
awaited_object_order();
value_selecting_object_coercion(true, null);
value_selecting_symbol_order(true, null);
assigned_class_coercion();
assigned_symbol_order();
logical_assigned_symbol_order();
console.log(logical_assigned_nullish());
logical_assigned_class_coercion();
tagged_template_symbol_order();
optional_member_symbol_order();
console.log(conditional_nullish_join(true));
console.log(call_object_coercion());
console.log(identifier_symbol_order(Symbol()));
console.log(optional_member_nullish(null));
console.log(member_value_symbol_order());
console.log(member_object_coercion());
