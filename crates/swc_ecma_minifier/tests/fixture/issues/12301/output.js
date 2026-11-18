!function() {
    try {
        throw 1;
    } finally{
        return;
    }
}(), console.log("ok"), function() {
    try {
        throw 1;
    } finally{
        return;
    }
}(), console.log("ok");
