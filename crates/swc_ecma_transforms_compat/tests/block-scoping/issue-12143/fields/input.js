for (let i = 0, C = class { x = i }; i < 1; i++) {
    console.log(new C().x);
}
for (let i = 0, C = class { #x = i }; i < 1; i++) {
    console.log(new C());
}
for (let i = 0, C = class { accessor x = i }; i < 1; i++) {
    console.log(new C().x);
}
for (let i = 0, C = class { accessor #x = i }; i < 1; i++) {
    console.log(new C());
}
// Computed keys and static initializers run during class evaluation.
for (let i = 0, C = class {
    [i] = 1;
    static x = i;
    static #x = i;
    static accessor y = i;
    static accessor #y = i;
    static { this.z = i; }
}; i < 1; i++) {
    console.log(new C());
}
