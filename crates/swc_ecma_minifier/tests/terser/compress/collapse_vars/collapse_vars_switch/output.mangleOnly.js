function a() {
    var a = sideeffect(), b = g1 + g2;
    var c = b / 4, d = "Bar" + c;
    switch(d){
        case 0:
            return g9;
    }
}
function b() {
    var a = g1 + g2, b = sideeffect();
    var c = a / 4;
    var d = "Bar" + c;
    switch(d){
        case 0:
            return g9;
    }
}
function c(a) {
    switch(a){
        case 1:
            var b = 3 - a;
            return b;
    }
}
