var o = 1;
do {
    console.log(
        (function () {
            return o ? "FAIL" : (o = "PASS");
            try {
                o = 2;
            } catch (o) {
                var o;
            }
        })()
    );
} while (o--);
