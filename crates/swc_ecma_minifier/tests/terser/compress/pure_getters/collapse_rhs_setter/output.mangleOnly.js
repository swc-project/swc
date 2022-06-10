try {
    console.log((({
        set length (v){
            throw "PASS";
        }
    }.length = "FAIL"), "FAIL"));
} catch (a) {
    console.log(a);
}
