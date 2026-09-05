function suffixDollar(value) {
    return `${value}\${evil}`;
}
function suffixBacktick(value) {
    return `${value}\``;
}
function prefixDollar(value) {
    return `\${evil}${value}`;
}
function interpolation(value) {
    return `${value}\${evil}\`\\\0\b\v\f\x1F\uD800`;
}
function concatenate(left, right) {
    return `${left}\${middle}${right}\``;
}
console.log([
    suffixDollar("a"),
    suffixBacktick("a"),
    prefixDollar("a"),
    interpolation("a").split("").map((ch)=>ch.charCodeAt(0).toString(16)).join(","),
    concatenate("a", "b")
].join("|"));
