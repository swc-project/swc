// A sloppy function must not inherit strictness from its replacement site.
async function f() {
    return this;
}
new class {
    m() {
        return f();
    }
}().m().then((value)=>console.log(value === globalThis), (error)=>console.log(error.name));
