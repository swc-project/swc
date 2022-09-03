//// [types.asyncGenerators.es2018.1.ts]
async function* inferReturnType1() {}
async function* inferReturnType2() {
    yield;
}
async function* inferReturnType3() {
    yield 1;
}
async function* inferReturnType4() {
    yield Promise.resolve(1);
}
async function* inferReturnType5() {
    yield 1, yield Promise.resolve(2);
}
async function* inferReturnType6() {
    yield* [
        1,
        2
    ];
}
async function* inferReturnType7() {
    yield* [
        Promise.resolve(1)
    ];
}
async function* inferReturnType8() {
    yield* async function*() {
        yield 1;
    }();
}
const assignability1 = async function*() {
    yield 1;
}, assignability2 = async function*() {
    yield Promise.resolve(1);
}, assignability3 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability4 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability5 = async function*() {
    yield* async function*() {
        yield 1;
    }();
}, assignability6 = async function*() {
    yield 1;
}, assignability7 = async function*() {
    yield Promise.resolve(1);
}, assignability8 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability9 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability10 = async function*() {
    yield* async function*() {
        yield 1;
    }();
}, assignability11 = async function*() {
    yield 1;
}, assignability12 = async function*() {
    yield Promise.resolve(1);
}, assignability13 = async function*() {
    yield* [
        1,
        2
    ];
}, assignability14 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
}, assignability15 = async function*() {
    yield* async function*() {
        yield 1;
    }();
};
async function* explicitReturnType1() {
    yield 1;
}
async function* explicitReturnType2() {
    yield Promise.resolve(1);
}
async function* explicitReturnType3() {
    yield* [
        1,
        2
    ];
}
async function* explicitReturnType4() {
    yield* [
        Promise.resolve(1)
    ];
}
async function* explicitReturnType5() {
    yield* async function*() {
        yield 1;
    }();
}
async function* explicitReturnType6() {
    yield 1;
}
async function* explicitReturnType7() {
    yield Promise.resolve(1);
}
async function* explicitReturnType8() {
    yield* [
        1,
        2
    ];
}
async function* explicitReturnType9() {
    yield* [
        Promise.resolve(1)
    ];
}
async function* explicitReturnType10() {
    yield* async function*() {
        yield 1;
    }();
}
async function* explicitReturnType11() {
    yield 1;
}
async function* explicitReturnType12() {
    yield Promise.resolve(1);
}
async function* explicitReturnType13() {
    yield* [
        1,
        2
    ];
}
async function* explicitReturnType14() {
    yield* [
        Promise.resolve(1)
    ];
}
async function* explicitReturnType15() {
    yield* async function*() {
        yield 1;
    }();
}
async function* explicitReturnType16() {
    yield 1;
}
async function* awaitedType1() {
    await 1;
}
async function* awaitedType2() {
    await Promise.resolve(1);
}
async function* nextType1() {
    yield;
}
