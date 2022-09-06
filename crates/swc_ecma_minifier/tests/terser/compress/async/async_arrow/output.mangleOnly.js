let a = async (a) => await foo(a);
let t = async () => await bar();
let w = async (a) => await baz(a);
let y = async (a, t) => {
    await far(a, t);
};
let c = async ({ x: a = [1], y: t = 2 }) => {
    await wow(a, t);
};
