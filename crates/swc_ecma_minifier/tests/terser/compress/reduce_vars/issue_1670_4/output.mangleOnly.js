(function a() {
    switch(1){
        case 0:
            var b = true;
            break;
        case 1:
            if (typeof b === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();
