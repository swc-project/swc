(function f() {
    switch (1) {
        case 0:
            var a = true;
            break;
        case 1:
            if (typeof a === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();
