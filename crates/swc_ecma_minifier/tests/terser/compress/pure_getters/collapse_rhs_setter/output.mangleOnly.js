try {
    console.log(
        (({
            set length(o) {
                throw "PASS";
            },
        }.length = "FAIL"),
        "FAIL")
    );
} catch (o) {
    console.log(o);
}
