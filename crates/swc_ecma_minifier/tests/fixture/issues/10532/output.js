try {
    var t1;
    t1 = t = {
        a: 1
    }, console.log(), Object.keys(t1).forEach(function(t2) {
        console.log(t1), console.log(t2), console.log(t1[t2]);
    });
} catch  {}
