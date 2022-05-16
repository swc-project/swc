[](function () {
    function a() {
        switch (b) {
            case "":
                a(function () {
                    a();
                });
        }
    }
});
