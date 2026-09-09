function conditional(a, b) {
    var c;
    try {
        if (a) return (c = b) || a;
        else (c = b)(c === b);
    } finally{
        console.log("assigned", c === b);
    }
}
console.log(conditional(true, 0));
console.log(conditional(true, 7));
conditional(false, function(assigned) {
    "use strict";
    console.log("call", void 0 === this, assigned);
});
function loops() {
    var c, a = 0, b = 1;
    while(a < 6){
        console.log("while", a = (c = b) + b, c);
        b++;
    }
    try {
        do {
            throw c = a + b;
        }while (c)
    } catch (value) {
        console.log("throw", value, c);
    }
    for(var i = 0; i < 3; i++)if ((c = i) && b) var c = c = record(i);
    console.log("for", c);
}
function record(value) {
    console.log("body", value);
    return value + 10;
}
loops();
function callTarget(object) {
    var c;
    (c = object.read)(c === object.read);
}
callTarget({
    read: function(assigned) {
        "use strict";
        console.log("receiver", void 0 === this, assigned);
    }
});
