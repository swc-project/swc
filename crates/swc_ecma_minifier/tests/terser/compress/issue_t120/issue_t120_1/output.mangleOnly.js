function a(a) {
    var b = function(a) {
        var b = a.data;
        return b && b.a != b.b;
    };
    while(b(a)){
        a = a.data;
    }
    return a;
}
var b = {
    a: 1,
    b: 2,
    data: {
        a: "hello"
    }
};
console.log(a(b).a, a({
    a: "world"
}).a);
