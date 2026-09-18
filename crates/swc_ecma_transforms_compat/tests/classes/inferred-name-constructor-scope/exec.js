let value;
value = class {
    constructor() {
        let value = function () {};
        this.local = value.name;
    }
    get() { return value; }
};
console.log(new value().local);

let current;
current = class {
    constructor() { this.value = eval("current"); }
    get() { return current; }
};
const Original = current;
current = 73;
console.log(new Original().value === 73);
