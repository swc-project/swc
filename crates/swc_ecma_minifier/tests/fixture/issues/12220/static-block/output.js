function F() {
    return class {
        static{
            this.value = new.target;
        }
    };
}
console.log(void 0 === new F().value);
