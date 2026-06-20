let C = class {
    static #m() {}
    static ok = #m in this;
};

console.log(C.ok);
