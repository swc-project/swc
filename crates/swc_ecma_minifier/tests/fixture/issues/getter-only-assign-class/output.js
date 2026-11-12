try {
    (class {
        static assign() {
            ({
                get count () {
                    return 0;
                }
            }).count = 1;
        }
    }).assign(), console.log("FAIL");
} catch (e) {
    console.log(e instanceof TypeError);
}
console.log(0);
