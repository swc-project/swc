var a = 100, b = 10;
(function(a, c) {
    switch(~c){
        case (b += c):
        case c++:
    }
})(--b, a);
console.log(a, b);
