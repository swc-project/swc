let mapValue, setValue;
console.log("set first"), console.log("set extra"), console.log("map extra");
const mapIterable = {
    [Symbol.iterator]: ()=>(console.log("map spread"), [][Symbol.iterator]())
};
new Map(mapValue = null, ...mapIterable);
const setIterable = {
    [Symbol.iterator]: ()=>(console.log("set spread"), [][Symbol.iterator]())
};
new Set(setValue = null, ...setIterable);
