let value;
value = class {
    get() { return value; }
};
console.log(value.name, new value().get() === value);

let other;
other = class {
    constructor() { this.created = true; }
    get() { return other; }
};
console.log(other.name, new other().created, new other().get() === other);

let Base;
Base = class {
    constructor() { this.created = true; }
    get() { return Base; }
};
class Derived extends Base {}
console.log(new Derived().get() === Base, new Derived().created);
