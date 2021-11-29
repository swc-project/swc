var E1, E2, t1, t2, t3, t4;
let E1;
(E1 = E1 || (E1 = {
}))[E1.one = 0] = "one";
let E2;
(E2 = E2 || (E2 = {
}))[E2.two = 0] = "two", t1 = [
    function(x) {
        return "foo";
    },
    function(x) {
        return 10;
    }
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
