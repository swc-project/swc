// A sloppy function must not inherit strictness from its replacement site.
async function f() {
    return this;
}
class C {
    m() {
        return f();
    }
}
new C().m().then(
    value => console.log(value === globalThis),
    error => console.log(error.name),
);
