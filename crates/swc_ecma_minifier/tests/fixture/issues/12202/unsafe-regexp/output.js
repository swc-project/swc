try {
    console.log(RegExp("["));
} catch (error) {
    console.log(error.name);
}
try {
    console.log(RegExp("a", "gg"));
} catch (error) {
    console.log(error.name);
}
console.log(RegExp("a.b", "ig").test("A0B"));
