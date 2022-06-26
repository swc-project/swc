function a() {
    var a = [];
    function b() {}
    a.map(b);
    function c() {}
    a.map(c);
    var d = ()=>{};
    a.map(d);
    a.map(d);
    var e = function() {};
    a.map(e);
    a.map(e);
}
