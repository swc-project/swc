[](function () {
    function a() {
        switch (b) {
            case "AssignmentPattern":
                a(function () {
                    a();
                });
        }
    }
});
