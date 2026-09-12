function Widget(value) {
    this.value = value;
}

const ns = { Widget };

function run(test) {
    return test ? new ns.Widget(1) : new ns.Widget(2);
}

console.log(run(true).value);
