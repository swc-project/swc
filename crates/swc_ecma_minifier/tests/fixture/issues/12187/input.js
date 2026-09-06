function argumentsDefault() {
    if (arguments.length !== 2) {
        throw new Error("arguments were dropped");
    }

    return {
        m(value = arguments.length) {
            return value;
        },
    }.m();
}

function evalDefault() {
    if (arguments.length !== 2) {
        throw new Error("arguments were dropped");
    }

    return {
        m(value = eval("arguments.length")) {
            return value;
        },
    }.m();
}

const superDefault = {
    __proto__: {
        value: 7,
    },
    m(value = super.value) {
        return value;
    },
};

function argumentsBody() {
    return {
        m() {
            return arguments.length;
        },
    }.m();
}

const superBody = {
    __proto__: {
        value: 7,
    },
    m() {
        return super.value;
    },
};

const safeDefault = {
    m(value = 5) {
        return value;
    },
};

console.log(
    argumentsDefault(1, 2),
    evalDefault(1, 2),
    superDefault.m(),
    argumentsBody(1, 2),
    superBody.m(),
    safeDefault.m(),
);
