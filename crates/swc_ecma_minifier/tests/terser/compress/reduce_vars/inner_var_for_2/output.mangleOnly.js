!(function() {
    var r = 1;
    for(var a = 1; --a;)var r = 2;
    console.log(r);
})();
