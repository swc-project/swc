console.log((function() {
    var a = 1;
    [].forEach(()=>{
        a = 2;
    });
    return a;
})());
