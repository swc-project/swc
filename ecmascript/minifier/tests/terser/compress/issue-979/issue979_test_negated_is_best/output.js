function f3() {
    (1 == a) | (2 == b) && foo();
}
function f4() {
    (1 == a) | (2 == b) && foo();
}
function f5() {
    1 == a && 2 == b && foo();
}
function f6() {
    1 != a || 2 != b || foo();
}
function f7() {
    if (1 != a && 2 != b) return bar();
    foo();
}
