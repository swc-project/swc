var E1, E2;
!function(E1) {
    E1[E1.x = 0] = "x";
}(E1 || (E1 = {})), (function(E2) {
    E2[E2.x = 0] = "x";
})(E2 || (E2 = {})), E1.x || E2.x;
