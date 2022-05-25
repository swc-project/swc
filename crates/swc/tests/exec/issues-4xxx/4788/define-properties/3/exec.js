let id = 0;

const obj = {};
Object.defineProperty(obj, "foo", {
    get: () => console.log("foo", id++),
    configurable: false,
});

obj.foo;

const obj2 = {
    ...obj,
};

obj2.foo;

const obj3 = {
    ...obj,
    foo: 1,
};

obj3.foo;

const obj4 = {
    foo: 2,
    ...obj,
    foo: 1,
};

obj4.foo;
