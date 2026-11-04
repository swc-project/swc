// Not in loop case. It's ok for this rule
var v = 10;
function foo() {
    console.log(v);
}

// it's unsafe
for (var i = 0; i < 10; i += 1) {
    function x() {
        alert(i);
    }
    x();
}

// it's safe
for (let i = 0; i < 10; i += 1) {
    function x() {
        alert(i);
    }
    x();
}


// Not ok, because 'z' declared out of loop
let z = 10;
let zz = 20;

for (let i = 0; i < 10; i += 1) {
    function x() {
        alert(z, zz);
    }
    x();
}

// Not ok
let a; for (let i in {}) { (function() { a; }); a = 1; }

// interview example =)
for (var i = 0; i < 10; i++) {
    setTimeout(() => {
        console.log(i);
    })
}

// it's ok
while (cond) {
    let x = 10;

    function ee() {
        alert(x);
    }
}

// not ok
while (true) {
    var a = 0;

    while (true) {
        setTimeout(() => {
            a;
        })
    }
}



let { aa, bb: { bb }, cc: [cc], ...ee } = obj;
for (const k in obj) {
    setTimeout(() => {
        aa;
        bb;
        cc;
        ee;
    })
}