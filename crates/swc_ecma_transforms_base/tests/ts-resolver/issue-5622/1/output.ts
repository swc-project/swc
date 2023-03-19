var x__2 = 1;
function foo__2(x__3, y__3 = function() {
    x__3 = 2;
}) {
    var x__3 = 3;
    y__3();
    expect(x__3).toBe(3);
}
foo__2();
expect(x__2).toBe(1);
