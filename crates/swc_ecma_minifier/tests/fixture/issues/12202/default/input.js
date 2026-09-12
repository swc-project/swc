try {
    console.log(new RegExp("["));
} catch (error) {
    console.log(error.name);
}

try {
    console.log(new RegExp("a", "gg"));
} catch (error) {
    console.log(error.name);
}

console.log(new RegExp("[a]", "ig").test("A"));
