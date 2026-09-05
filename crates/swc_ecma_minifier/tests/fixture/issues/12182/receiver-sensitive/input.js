const receiver = {
    value: "variable receiver",
    read: function () {
        return this.value;
    },
};

console.log(receiver.read());
console.log(({
    value: "direct receiver",
    read: function () {
        return this.value;
    },
}).read());

function read() {
    return this.value;
}

const shorthandReceiver = {
    value: "shorthand receiver",
    read,
};

console.log(shorthandReceiver.read());

function readExplicit() {
    return this.value;
}

const explicitReceiver = {
    value: "explicit receiver",
    read: readExplicit,
};

console.log(explicitReceiver.read());
console.log(({
    value: "direct identifier receiver",
    read: readExplicit,
}).read());

const parameterReceiver = {
    value: "parameter receiver",
    read: function (value = this.value) {
        return value;
    },
};

console.log(parameterReceiver.read());
console.log(({
    value: "direct parameter receiver",
    read: function (value = this.value) {
        return value;
    },
}).read());

const capturedReceiver = {
    value: "captured receiver",
    read: function () {
        return (() => this.value)();
    },
};

console.log(capturedReceiver.read());
