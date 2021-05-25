let a1 = async (x) => await foo(x);
let a2 = async () => await bar();
let a3 = async (x) => await baz(x);
let a4 = async (x, y) => {
    await far(x, y);
};
let a5 = async ({ x: x = [1], y: z = 2 }) => {
    await wow(x, z);
};
