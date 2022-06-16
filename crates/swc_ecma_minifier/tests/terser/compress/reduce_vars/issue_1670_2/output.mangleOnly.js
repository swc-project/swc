(function a() {
    switch(1){
        case 0:
            var b = true;
            break;
        default:
            if (typeof b === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();
