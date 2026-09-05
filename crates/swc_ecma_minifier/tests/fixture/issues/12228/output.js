const empty = {
    *[Symbol.iterator] () {
        console.log("empty");
    }
};
const values = {
    *[Symbol.iterator] () {
        console.log("iterated");
        yield Symbol();
    }
};
console.log(Symbol("description", ...values).description);
console.log(Symbol(...empty, void 0, ...values).description);
