function read(flag) {
    const a = {
        foo: "A"
    };
    const b = {
        foo: "B"
    };
    return (flag ? a : b)["foo"];
}
console.log(read(true), read(false));
