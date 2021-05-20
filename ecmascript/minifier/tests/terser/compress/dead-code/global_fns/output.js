try {
    Function(1, 2);
} catch (e) {
    console.log(e.name);
}
try {
    RegExp(1, 2);
} catch (e) {
    console.log(e.name);
}
try {
    Array(NaN);
} catch (e) {
    console.log(e.name);
}
