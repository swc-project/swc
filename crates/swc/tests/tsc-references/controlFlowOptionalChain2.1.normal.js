//// [controlFlowOptionalChain2.ts]
function funcTwo(arg) {
    if ((arg === null || arg === void 0 ? void 0 : arg.type) === 'B') {
        arg; // `B`
        return;
    }
    arg;
    arg === null || arg === void 0 ? void 0 : arg.name;
}
function funcThree(arg) {
    if ((arg === null || arg === void 0 ? void 0 : arg.type) === 'B') {
        arg; // `B`
        return;
    }
    arg;
    arg === null || arg === void 0 ? void 0 : arg.name;
}
function f1(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === undefined) {
        x; // U | undefined
    } else {
        x; // X
    }
}
function f2(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === undefined) {
        x; // undefined
    } else {
        x; // X | N
    }
}
function f3(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === undefined) {
        x; // U | null
    } else {
        x; // X
    }
}
function f4(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === undefined) {
        x; // null
    } else {
        x; // X | N
    }
}
function f5(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === null) {
        x; // never
    } else {
        x; // X | U | undefined
    }
}
function f6(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === null) {
        x; // N
    } else {
        x; // X | undefined
    }
}
function f7(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === null) {
        x; // never
    } else {
        x; // X | U | null
    }
}
function f8(x) {
    if ((x === null || x === void 0 ? void 0 : x.kind) === null) {
        x; // N
    } else {
        x; // X | null
    }
}
