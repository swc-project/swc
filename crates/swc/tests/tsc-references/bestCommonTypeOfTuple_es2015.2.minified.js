var E1, E2, t1, t2, t3, t4;
function f2(x) {
    return 10;
}
!function(E1) {
    E1[E1.one = 0] = "one";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.two = 0] = "two";
}(E2 || (E2 = {})), t1 = [
    function(x) {
        return "foo";
    },
    f2
], t2 = [
    E1.one,
    E2.two
], t3 = [
    5,
    void 0
], t4 = [
    E1.one,
    E2.two,
    20
], t1[2], t2[2], t3[2], t4[3];
