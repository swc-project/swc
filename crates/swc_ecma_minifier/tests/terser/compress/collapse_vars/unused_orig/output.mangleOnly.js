var a = 1;
console.log((function(a) {
    var b;
    var c = a;
    for(var d in c){
        var b;
        return --a + c[0];
    }
    try {} catch (e) {
        --a + b;
    }
    b && b.NaN;
})([
    2
]), a);
