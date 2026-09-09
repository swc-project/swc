for (let i = 0, read = () => i;;) {
    i = function () {};
    console.log(i.name, read());
    i = class {};
    console.log(i.name);
    i = () => i;
    console.log(i.name, i() === i);
    i = function () { return i; };
    console.log(i.name, i() === i);
    i = class { get() { return i; } };
    console.log(i.name, new i().get() === i);
    i = (function () {});
    console.log(i.name);
    i = function explicit() {};
    console.log(i.name);
    i = class Explicit {};
    console.log(i.name);
    break;
}
