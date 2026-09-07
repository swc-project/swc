function conditional(a, b) {
    var c;
    try {
        if (a) return (c = b), c || a;
        else (c = b), c(c === b);
    } finally {
        console.log("assigned", c === b);
    }
}
console.log(conditional(true, 0));
console.log(conditional(true, 7));
conditional(false, function (assigned) {
    "use strict";
    console.log("call", this === undefined, assigned);
});

function loops() {
    var a = 0, b = 1, c;
    while (a < 6) {
        (c = b), (a = c + b);
        console.log("while", a, c);
        b++;
    }
    try {
        do {
            throw ((c = a + b), c);
        } while (c);
    } catch (value) {
        console.log("throw", value, c);
    }
    for (var i = 0; i < 3; i++) {
        if (((c = i), c && b)) var c = ((c = record(i)), c);
    }
    console.log("for", c);
}
function record(value) {
    console.log("body", value);
    return value + 10;
}
loops();

function callTarget(object) {
    var c;
    (c = object.read), c(c === object.read);
}
callTarget({
    read: function (assigned) {
        "use strict";
        console.log("receiver", this === undefined, assigned);
    }
});
