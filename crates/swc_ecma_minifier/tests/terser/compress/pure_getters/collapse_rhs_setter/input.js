try {
    console.log(
        (({
            set length(v) {
                throw "PASS";
            },
        }.length = "FAIL"),
        "FAIL")
    );
} catch (e) {
    console.log(e);
}
