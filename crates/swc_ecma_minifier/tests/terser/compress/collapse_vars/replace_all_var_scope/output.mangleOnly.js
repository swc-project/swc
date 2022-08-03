var c = 100, a = 10;
(function(c, s) {
    switch(~s){
        case (a += s):
        case s++:
    }
})(--a, c);
console.log(c, a);
