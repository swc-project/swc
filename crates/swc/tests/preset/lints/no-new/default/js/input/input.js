new A();

(new A());

(0, new A());

var {
    x = () => {
        new A()
    },
    y: {
        z = () => {
            new A()
        }
    }
} = obj;

var [
    a = () => { new A() },
    [ b = () => { new A() } ]
] = [];

(0, new A(), 0);

var x = new A(() => {
    new B();
})

// should check only outer new expr
new A(new A());

new A(new A(() => {
    new B();
}));

var x = (new A(), 0);

var x = (0, new A(() => {
    new B();
}));

var x = {
    x: new A(() => {
        new B()
    })
}

function foo(arg = () => { new A() }) {}

// Valid cases
var x = new A();

x = new A();

var {
    x = new A()
} = obj;


var x = (0, new A());

var x = {
    a: new A(),
};

f(new A());

f({
    x: new A(),
})

class X {
    constructor() {
        this.x = new A();
    }
}

