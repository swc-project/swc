console.log((function() {
    var r = 1;
    [].forEach(()=>(r = 2));
    return r;
})());
