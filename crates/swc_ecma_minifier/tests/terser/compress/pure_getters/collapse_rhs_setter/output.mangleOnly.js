try {
    console.log((({
        set length (v){
            throw "PASS";
        }
    }.length = "FAIL"), "FAIL"));
} catch (t) {
    console.log(t);
}
