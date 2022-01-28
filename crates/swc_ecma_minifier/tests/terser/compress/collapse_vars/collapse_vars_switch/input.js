function f1() {
    var not_used = sideeffect(),
        x = g1 + g2;
    var y = x / 4,
        z = "Bar" + y;
    switch (z) {
        case 0:
            return g9;
    }
}
function f2() {
    var x = g1 + g2,
        not_used = sideeffect();
    var y = x / 4;
    var z = "Bar" + y;
    switch (z) {
        case 0:
            return g9;
    }
}
function f3(x) {
    switch (x) {
        case 1:
            var a = 3 - x;
            return a;
    }
}
