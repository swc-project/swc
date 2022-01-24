async function foo1(one, two, three) {
    return 42;
}

console.log(foo1.length);

async function* foo2(one, two, three) {
    return 42;
}

console.log(foo2.length);

const bar1 = async function (one, two, three) {
    return 42;
};

console.log(bar1.length);

const bar2 = async function* (one, two, three) {
    return 42;
};

console.log(bar2.length);

const bar3 = async (one, two, three) => {
    return 42;
};

console.log(bar3.length);
