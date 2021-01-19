function x() {
    var getsInlined = function () {
        var leakedVariable1 = 3;
        var leakedVariable2 = 1 + 2 * leakedVariable1;
        console.log(leakedVariable1);
        console.log(leakedVariable2);
    };
    var getsDropped = getsInlined();
}
