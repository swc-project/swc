var a = 1;
console.log(
    new (class {
        a() {
            a = 2;
            return a;
        }
    })().a(),
    a
);
