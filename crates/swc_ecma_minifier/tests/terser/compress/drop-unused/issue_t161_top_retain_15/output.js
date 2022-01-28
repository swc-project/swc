class Alpha {
    num() {
        return n;
    }
}
let n = 2,
    u = 4;
console.log(
    n,
    3,
    u,
    3 * n,
    n * u,
    3 * u,
    n,
    3,
    u,
    new Alpha().num(),
    new (class {
        num() {
            return 3;
        }
    })().num(),
    new (class {
        num() {
            return u;
        }
    })().num()
);
