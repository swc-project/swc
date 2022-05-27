var a = 1;
console.log((function(b) {
    var a;
    var c = b;
    for(var d in c){
        var a;
        return --b + c[0];
    }
    try {} catch (e) {
        --b + a;
    }
    a && a.NaN;
})([
    2
]), a);
