function classify(value) {
    if (Number.isNaN(value)) {
        return "NaN";
    }

    if (Object.is(value, -0)) {
        return "-0";
    }

    return String(value);
}

function test(flag) {
    console.log([
        flag ? Infinity : 0,
        flag ? 0 : Infinity,
        flag ? 1 : -0,
        flag ? -0 : 1,
    ].map(classify).join(","));
}

globalThis.trueValue = true;
globalThis.falseValue = false;

test(globalThis.trueValue);
test(globalThis.falseValue);
