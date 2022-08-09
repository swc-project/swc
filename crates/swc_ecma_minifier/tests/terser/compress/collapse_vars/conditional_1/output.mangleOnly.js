function r(r, $) {
    var _ = "";
    var n = $ ? ">" : "<";
    if (r) _ += "=";
    return (_ += n);
}
console.log(r(0, 0), r(0, 1), r(1, 0), r(1, 1));
