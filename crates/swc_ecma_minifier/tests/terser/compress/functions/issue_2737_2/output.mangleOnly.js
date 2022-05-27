(function(a) {
    for(; a();)break;
})(function a() {
    return console.log("PASS"), a;
});
