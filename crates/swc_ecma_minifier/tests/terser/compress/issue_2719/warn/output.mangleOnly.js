function a() {
    return b();
}
function b() {
    return b["call" + "er"].arguments;
}
console.log(a(1, 2, 3).length);
