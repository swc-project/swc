//// [controlFlowOptionalChain2.ts]
function funcTwo(arg) {
    var _arg, _arg1;
    if (((_arg = arg) === null || _arg === void 0 ? void 0 : _arg.type) === "B") {
        arg; // `B`
        return;
    }
    arg;
    (_arg1 = arg) === null || _arg1 === void 0 ? void 0 : _arg1.name;
}
function funcThree(arg) {
    var _arg, _arg1;
    if (((_arg = arg) === null || _arg === void 0 ? void 0 : _arg.type) === "B") {
        arg; // `B`
        return;
    }
    arg;
    (_arg1 = arg) === null || _arg1 === void 0 ? void 0 : _arg1.name;
}
function f1(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === undefined) {
        x; // U | undefined
    } else {
        x; // X
    }
}
function f2(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === undefined) {
        x; // undefined
    } else {
        x; // X | N
    }
}
function f3(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === undefined) {
        x; // U | null
    } else {
        x; // X
    }
}
function f4(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === undefined) {
        x; // null
    } else {
        x; // X | N
    }
}
function f5(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === null) {
        x; // never
    } else {
        x; // X | U | undefined
    }
}
function f6(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === null) {
        x; // N
    } else {
        x; // X | undefined
    }
}
function f7(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === null) {
        x; // never
    } else {
        x; // X | U | null
    }
}
function f8(x) {
    var _x;
    if (((_x = x) === null || _x === void 0 ? void 0 : _x.kind) === null) {
        x; // N
    } else {
        x; // X | null
    }
}
