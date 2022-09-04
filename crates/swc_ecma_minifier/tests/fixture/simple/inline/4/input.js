function $parcel$export(a, b, c) {
    a[b] = c;
}
$parcel$export(module.exports, "A", function () {
    return A;
});
$parcel$export(module.exports, "B", function () {
    return B;
});
$parcel$export(module.exports, "C", function () {
    return C;
});
const A = "A",
    B = "B",
    C = "C";
