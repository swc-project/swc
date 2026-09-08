for (let i = 0, C = class { x = i }; i < 1;) {
    i = 42;
    console.log(new C().x);
    break;
}

for (let i = 0, C = class {
    #x = i;
    get value() { return this.#x; }
}; i < 1;) {
    i = 42;
    console.log(new C().value);
    break;
}

for (let i = 0, C = class {
    [i] = ++i;
    static value = i;
}, initial = i = 2; i < 3; i++) {
    console.log(new C()[0], i, initial, C.value);
}

for (let i = 0, C = class {
    [i] = 1;
    static value = i;
    static { this.other = i; }
}; i < 1; i++) {
    console.log(new C()[0], C.value, C.other);
}
