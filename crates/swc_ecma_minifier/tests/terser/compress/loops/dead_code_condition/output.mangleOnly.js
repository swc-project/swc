for(var o = 0, r = 5; ((o += 1), 3) - 3 && r > 0; r--){
    var a = (function() {
        r--;
    })(o++);
}
console.log(o);
