var c = new class {
    [Symbol.iterator](x) {
    }
};
c[Symbol.iterator](""), c[Symbol.iterator](0);
