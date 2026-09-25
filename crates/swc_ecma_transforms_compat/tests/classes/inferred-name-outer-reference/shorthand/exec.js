let value;
value = class { get() { return { value }; } };
console.log(value.name, new value().get().value === value);

let outer, inner;
outer = class {
    next() {
        inner = class { get() { return { outer, inner }; } };
        return inner;
    }
};
const Inner = new outer().next();
console.log(outer.name, inner.name, new Inner().get().outer === outer);

let logical;
logical ||= class { get() { return { logical }; } };
let nullish;
nullish ??= class { get() { return { nullish }; } };
console.log(logical.name, nullish.name);

let assigned;
assigned = class { set(next) { assigned = next; } };
const Assigned = assigned;
console.log(Assigned.name);
new Assigned().set(7);
console.log(assigned);

let destructured;
destructured = class { set(next) { ({ value: destructured } = next); } };
const Destructured = destructured;
console.log(Destructured.name);
new Destructured().set({value: 9});
console.log(destructured);
