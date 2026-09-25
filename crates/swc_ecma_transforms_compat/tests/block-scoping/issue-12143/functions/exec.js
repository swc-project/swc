for (let i = 0, read = function () { return i; }; i < 1; i++) {
    i = 1;
    console.log(read());
}

for (let i = 0, object = {
    read() { return i; },
    get value() { return i; },
    set value(value) { i = value; }
}; i < 1; i++) {
    i = 2;
    console.log(object.read(), object.value);
    object.value = 3;
    console.log(i, object.read(), object.value);
}

for (let i = 0, Read = class {
    constructor() { this.value = i; }
}; i < 1; i++) {
    i = 4;
    console.log(new Read().value);
}
