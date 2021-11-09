var E1, E2, E11, E21, t1, t2, t3, t4;
(E1 = E11 || (E11 = {
}))[E1.one = 0] = "one", (E2 = E21 || (E21 = {
}))[E2.two = 0] = "two", t1 = [
    function(x) {
        return "foo";
    },
    function(x) {
        return 10;
    }
], t2 = [
    E11.one,
    E21.two
], t3 = [
    5,
    void 0
], t4 = [
    E11.one,
    E21.two,
    20
], t1[2], t2[2], t3[2], t4[3];
