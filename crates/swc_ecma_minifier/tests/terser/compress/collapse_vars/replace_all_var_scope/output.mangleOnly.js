var c = 100, o = 10;
(function(s, c) {
    switch(~c){
        case (o += c):
        case c++:
    }
})(--o, c);
console.log(c, o);
