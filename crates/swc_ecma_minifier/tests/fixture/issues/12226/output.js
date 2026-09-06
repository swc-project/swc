try {
    console.log((console.log("sequence"), ((a)=>1)(missing)));
} catch (error) {
    console.log(error.name);
}
try {
    console.log(((a)=>1)(missing));
} catch (error) {
    console.log(error.name);
}
const object = {
    get value () {
        return console.log("getter"), 1;
    }
};
console.log((console.log("member"), ((a)=>1)(object.value))), console.log((console.log("no-argument"), 2)), console.log((console.log("primitive"), 3));
