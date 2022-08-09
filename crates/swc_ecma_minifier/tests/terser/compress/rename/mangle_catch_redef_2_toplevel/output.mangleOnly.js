try {
    throw "FAIL1";
} catch (r) {
    var r = "FAIL2";
}
console.log(r);
