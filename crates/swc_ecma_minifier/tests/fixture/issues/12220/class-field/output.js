function F() {
    return class {
        static p = new.target;
    };
}
console.log(void 0 === new F().p);
