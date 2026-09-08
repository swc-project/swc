const evalReceiver = {
    value: "variable eval receiver",
    read: function () {
        return eval("this").value;
    },
};

console.log(evalReceiver.value);
console.log(evalReceiver.read());
console.log(({
    value: "direct eval receiver",
    read: function () {
        return eval("this").value;
    },
}).read());
