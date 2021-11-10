function a1() {
    var a = [
        ,
        ,
        1
    ];
    var [b] = a;
    f(b);
}
function b1() {
    var a = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: a  }] = a;
    f(b1);
}
