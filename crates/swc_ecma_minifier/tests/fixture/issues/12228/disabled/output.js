const values = {
    *[Symbol.iterator] () {
        console.log("iterated");
        yield "value";
    }
};
Symbol(...values);
console.log(Symbol("description").description);
