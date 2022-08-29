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
    yield 1;
    yield Promise.resolve(2);
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
};
const assignability2 = async function*() {
    yield Promise.resolve(1);
};
const assignability3 = async function*() {
    yield* [
        1,
        2
    ];
};
const assignability4 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
};
const assignability5 = async function*() {
    yield* async function*() {
        yield 1;
    }();
};
const assignability6 = async function*() {
    yield 1;
};
const assignability7 = async function*() {
    yield Promise.resolve(1);
};
const assignability8 = async function*() {
    yield* [
        1,
        2
    ];
};
const assignability9 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
};
const assignability10 = async function*() {
    yield* async function*() {
        yield 1;
    }();
};
const assignability11 = async function*() {
    yield 1;
};
const assignability12 = async function*() {
    yield Promise.resolve(1);
};
const assignability13 = async function*() {
    yield* [
        1,
        2
    ];
};
const assignability14 = async function*() {
    yield* [
        Promise.resolve(1)
    ];
};
const assignability15 = async function*() {
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
    const x = await 1;
}
async function* awaitedType2() {
    const x = await Promise.resolve(1);
}
async function* nextType1() {
    const x = yield; // `number | PromiseLike<number>` (should not await TNext)
}
