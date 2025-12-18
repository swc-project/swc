let obj = {};

// Multiple else-if chain with nullish coalescing
if ((obj.a ?? 0) > 0) {
    console.log("a");
} else if ((obj.b ?? 0) > 0) {
    console.log("b");
} else if ((obj.c ?? 0) > 0) {
    console.log("c");
} else if ((obj.d ?? 0) > 0) {
    console.log("d");
} else if ((obj.e ?? 0) > 0) {
    console.log("e");
}

// Deeply nested if statements with nullish coalescing
if ((obj.x ?? 0) > 0) {
    if ((obj.y ?? 0) > 0) {
        if ((obj.z ?? 0) > 0) {
            if ((obj.w ?? 0) > 0) {
                console.log("all set");
            } else if ((obj.w2 ?? 0) > 0) {
                console.log("w2");
            }
        } else if ((obj.z2 ?? 0) > 0) {
            console.log("z2");
        }
    } else if ((obj.y2 ?? 0) > 0) {
        console.log("y2");
    }
} else if ((obj.x2 ?? 0) > 0) {
    console.log("x2");
}

// Mixed nesting with blocks
if (true) {
    if ((obj.foo ?? 0) > 0) {
        console.log("foo");
    } else if ((obj.bar ?? 0) > 0) {
        if ((obj.baz ?? 0) > 0) {
            console.log("baz");
        } else if ((obj.qux ?? 0) > 0) {
            console.log("qux");
        }
    }
}

// In function scope
function test() {
    if ((obj.fn1 ?? 0) > 0) {
        console.log("fn1");
    } else if ((obj.fn2 ?? 0) > 0) {
        if ((obj.fn3 ?? 0) > 0) {
            console.log("fn3");
        } else if ((obj.fn4 ?? 0) > 0) {
            console.log("fn4");
        }
    }
}

// Arrow function with nested conditions
const arrowTest = () => {
    if ((obj.arrow1 ?? 0) > 0) {
        console.log("arrow1");
    } else if ((obj.arrow2 ?? 0) > 0) {
        if ((obj.arrow3 ?? 0) > 0) {
            console.log("arrow3");
        }
    }
};
