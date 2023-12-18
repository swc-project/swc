var c = 100, o = 10;
(function(c, o) {
    switch(~o){
        case (o += o):
        case o++:
    }
})(--o, c);
console.log(c, o);
