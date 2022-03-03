// Z Combinator
const Z = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));

const p = Z(
    (f) =>
        async (n = 0) =>
            n <= 1 ? 1 : n * (await f(n - 1))
)(5);

// expect to be 120
p.then((result) => console.log(result));
