try {
    console.log((({
        set length (v){
            throw "PASS";
        }
    }.length = "FAIL"), "FAIL"));
} catch (o) {
    console.log(o);
}
