var x__1 = 1;
function foo__1(x__2, y__2 = function() {
    x__2 = 2;
}) {
    var x__2 = 3;
    y__2();
    expect(x__2).toBe(3);
}
foo__1();
expect(x__1).toBe(1);
