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
