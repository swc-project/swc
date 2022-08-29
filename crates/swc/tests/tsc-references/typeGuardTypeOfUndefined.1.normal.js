//// [typeGuardTypeOfUndefined.ts]
// undefined type guard adds no new type information
function test1(a) {
    if (typeof a !== "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test2(a) {
    if (typeof a === "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test3(a) {
    if (typeof a === "undefined" || typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test4(a) {
    if (typeof a !== "undefined" && typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test5(a) {
    if (typeof a !== "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test6(a) {
    if (typeof a === "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test7(a) {
    if (typeof a === "undefined" || typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test8(a) {
    if (typeof a !== "undefined" && typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test9(a) {
    if (typeof a !== "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test10(a) {
    if (typeof a === "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test11(a) {
    if (typeof a === "undefined" || typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test12(a) {
    if (typeof a !== "undefined" && typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test13(a) {
    if (typeof a !== "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test14(a) {
    if (typeof a === "undefined") {
        if (typeof a === "boolean") {
            a;
        } else {
            a;
        }
    } else {
        a;
    }
}
function test15(a) {
    if (typeof a === "undefined" || typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
function test16(a) {
    if (typeof a !== "undefined" && typeof a === "boolean") {
        a;
    } else {
        a;
    }
}
