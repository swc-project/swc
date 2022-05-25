let id = 0;

const obj = {
    get foo() {
        console.log("foo", id++);
    },
};

const obj2 = {
    ...obj,
};
const obj3 = {
    ...obj,
    foo: 1,
};
const obj4 = {
    foo: 2,
    ...obj,
    foo: 1,
};
