let outer;
outer = class {
    constructor() { this.Inner = class { outer() {} }; }
    get() { return outer; }
};
console.log(outer.name, new outer().get() === outer);

let value;
value = class {
    next() {
        value = class {
            get() { return value; }
        };
        return value;
    }
    get() { return value; }
};
const First = value;
const Second = new First().next();
console.log(First.name, Second.name, new First().get() === Second);

let a, b, c;
a = class {
    next() {
        b = class {
            next() {
                c = class { get() { return a; } };
                return c;
            }
        };
        return b;
    }
};
const B = new a().next();
const C = new B().next();
console.log(a.name, B.name, C.name, new C().get() === a);

let distinct;
distinct = class {
    get() {
        let distinct;
        distinct = class { get() { return distinct; } };
        return distinct;
    }
};
const Inner = new distinct().get();
console.log(distinct.name, Inner.name, new Inner().get() === Inner);

let logical;
logical ||= class { get() { return logical; } };
let nullish;
nullish ??= class { get() { return nullish; } };
console.log(logical.name, nullish.name);

let deep, child;
deep = class {
    constructor() {
        child = class {
            constructor() { this.value = 7; }
            get() { return child; }
        };
    }
    get() { return deep; }
};
new deep();
console.log(deep.name, child.name, new child().value);

let computed;
computed = class {
    constructor() { this.Inner = class { [super.toString()]() {} }; }
    get() { return computed; }
};
console.log(computed.name, Object.getOwnPropertyNames(new computed().Inner.prototype).join());

const object = {};
object.value = class {
    next() {
        object.value = class { next() { return 7; } };
        return object.value;
    }
};
console.log(new (new object.value().next())().next());
