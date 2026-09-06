new Set(null);
new Map(undefined);
new Set(void console.log("set first"), console.log("set extra"));
new Map(null, console.log("map extra"));

let mapValue;
const mapIterable = {
    [Symbol.iterator]() {
        console.log("map spread");
        return [][Symbol.iterator]();
    },
};
new Map(mapValue = null, ...mapIterable);

let setValue;
const setIterable = {
    [Symbol.iterator]() {
        console.log("set spread");
        return [][Symbol.iterator]();
    },
};
new Set(setValue = null, ...setIterable);
