const values = {
    *[Symbol.iterator]() {
        console.log("iterated");
        yield Symbol();
    },
};

console.log(Symbol("description", ...values).description);
