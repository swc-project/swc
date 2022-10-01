(function(o, i) {
    while(i--)console.log(o.b || o);
})({
    b: "PASS"
}, 1);
