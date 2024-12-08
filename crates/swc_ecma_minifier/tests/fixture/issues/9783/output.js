!function(e) {
    try {
        t = JSON.stringify("aa");
    } catch (r) {
        t = String("aa");
    }
    for(var r = 0, o = 0; o < t.length; o++)r += 1;
    console.log(r);
}(0);
