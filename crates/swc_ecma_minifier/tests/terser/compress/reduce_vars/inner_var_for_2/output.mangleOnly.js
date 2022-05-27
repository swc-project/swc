!(function() {
    var a = 1;
    for(var b = 1; --b;)var a = 2;
    console.log(a);
})();
