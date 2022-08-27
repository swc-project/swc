//// [types.asyncGenerators.es2018.2.ts]
async function* inferReturnType1() {
    yield* {};
}
async function* inferReturnType2() {
    yield* inferReturnType2();
}
async function* inferReturnType3() {
    yield* Promise.resolve([
        1,
        2
    ]);
}
const assignability1 = async function*() {
    yield "a";
};
const assignability2 = async function*() {
    yield* [
        "a",
        "b"
    ];
};
const assignability3 = async function*() {
    yield* async function*() {
        yield "a";
    }();
};
const assignability4 = async function*() {
    yield "a";
};
const assignability5 = async function*() {
    yield* [
        "a",
        "b"
    ];
};
const assignability6 = async function*() {
    yield* async function*() {
        yield "a";
    }();
};
const assignability7 = async function*() {
    yield "a";
};
const assignability8 = async function*() {
    yield* [
        "a",
        "b"
    ];
};
const assignability9 = async function*() {
    yield* async function*() {
        yield "a";
    }();
};
async function* explicitReturnType1() {
    yield "a";
}
async function* explicitReturnType2() {
    yield* [
        "a",
        "b"
    ];
}
async function* explicitReturnType3() {
    yield* async function*() {
        yield "a";
    }();
}
async function* explicitReturnType4() {
    yield "a";
}
async function* explicitReturnType5() {
    yield* [
        "a",
        "b"
    ];
}
async function* explicitReturnType6() {
    yield* async function*() {
        yield "a";
    }();
}
async function* explicitReturnType7() {
    yield "a";
}
async function* explicitReturnType8() {
    yield* [
        "a",
        "b"
    ];
}
async function* explicitReturnType9() {
    yield* async function*() {
        yield "a";
    }();
}
async function* explicitReturnType10() {
    yield 1;
}
async function* explicitReturnType11() {
    yield 1;
}
async function* explicitReturnType12() {
    yield 1;
}
async function* yieldStar() {
    yield* {};
}
