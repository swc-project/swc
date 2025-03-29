r: {
    try {
        t = JSON.stringify("aa");
    } catch (r1) {
        t = String("aa");
    }
    for(var r1 = 0, o = 0; o < t.length; o++)r1 += 1;
    console.log(r1);
    break r;
}
